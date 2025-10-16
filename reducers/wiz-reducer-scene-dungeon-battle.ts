import type { WizStateEntity } from "@/engine/entities/wiz-state-entity"
import { WizStateSceneBookEntity } from "@/engine/entities/wiz-state-scene-book.entity"
import { WizStateSceneDungeonEntity } from "@/engine/entities/wiz-state-scene-dungeon.entity"
import type { WizStateSceneDungeonBattleEntity } from "@/engine/entities/wiz-state-scene-dungeon-battle.entity"
import type { WizAction } from "@/engine/types"

/**
 * wizReducerSceneDungeonBattle
 */
export function wizReducerSceneDungeonBattle(
  state: WizStateSceneDungeonBattleEntity,
  action: WizAction,
): WizStateEntity {
  if (action.type === "ADD_USER_ACTION") {
    const newState = state.withAddedLogs(action.payload)
    return newState.withIncrementedChatCount()
  }

  if (action.type === "ADD_EVENT_CHAT") {
    const messages = action.payload.map((log) => ({
      id: crypto.randomUUID(),
      type: "EVENT_CHAT" as const,
      characterId: log.characterId,
      text: log.text,
    }))
    return state.withAddedLogs(messages)
  }

  if (action.type === "BATTLE_ATTACK") {
    // 生きている味方と敵を取得
    const allMembers = state.vault.members
    const aliveMembers = allMembers.filter((m) => m.hp > 0)
    const aliveEnemies = state.enemies.filter((e) => e.hp > 0)

    if (aliveMembers.length === 0 || aliveEnemies.length === 0) {
      return state
    }

    // ターン全体のactionQueueを構築（メッセージなし）
    const actionQueue = []

    // 1. すべての味方が攻撃（それぞれランダムな敵を選択）
    for (const member of aliveMembers) {
      const randomIndex = Math.floor(Math.random() * aliveEnemies.length)
      const targetEnemy = aliveEnemies[randomIndex]

      actionQueue.push({
        type: "PLAYER_ATTACK" as const,
        actorId: member.id,
        targetEnemyId: targetEnemy.id,
      })
    }

    // 2. すべての敵が反撃（それぞれランダムな味方を選択）
    for (const enemy of aliveEnemies) {
      const randomIndex = Math.floor(Math.random() * aliveMembers.length)
      const targetMember = aliveMembers[randomIndex]

      actionQueue.push({
        type: "ENEMY_ATTACK" as const,
        actorEnemyId: enemy.id,
        targetCharacterId: targetMember.id,
      })
    }

    // 3. ターン終了
    actionQueue.push({
      type: "END_TURN" as const,
    })

    // actionQueueをセット（実行はしない）
    return state.withActionQueue(actionQueue)
  }

  if (action.type === "SET_BATTLE_MESSAGES") {
    return state.withBattleMessages(action.payload)
  }

  if (action.type === "PROCESS_NEXT_ACTION") {
    const actionQueue = state.actionQueue

    if (actionQueue.length === 0) {
      return state
    }

    const [currentAction, ...remainingActions] = actionQueue

    // 処理済みアクション数 = 元の総数 - 残りの数
    const processedCount = state.vault.logs.filter(
      (log) =>
        log.type === "EVENT_PLAYER_ATTACK" || log.type === "EVENT_ENEMY_ATTACK",
    ).length
    const currentActionIndex = processedCount

    // AIメッセージを取得（存在する場合）
    const [aiMessage, ...remainingMessages] = state.battleMessages

    // PLAYER_ATTACK: プレイヤーの攻撃を実行
    if (currentAction.type === "PLAYER_ATTACK") {
      const allMembers = state.vault.members
      const attacker = allMembers.find((m) => m.id === currentAction.actorId)
      const targetEnemy = state.enemies.find(
        (e) => e.id === currentAction.targetEnemyId,
      )

      // 攻撃者が死んでいるか対象が存在しない場合はスキップ（メッセージも削除）
      if (!attacker || attacker.hp <= 0 || !targetEnemy) {
        // 仲間の場合はAIメッセージ（dialogue + scene = 2つ）を削除
        const isAlly = attacker && attacker.id !== state.vault.player.id
        return state
          .withActionQueue(remainingActions)
          .withBattleMessages(isAlly ? remainingMessages.slice(2) : remainingMessages)
      }

      // ダメージ計算
      const damage = Math.max(1, attacker.atk - Math.floor(targetEnemy.def / 2))
      const newHp = Math.max(0, targetEnemy.hp - damage)

      // プレイヤー本人か仲間かで処理を分ける
      const isPlayer = attacker.id === state.vault.player.id

      const logs: Array<
        | {
            id: string
            type: "EVENT_PLAYER_ATTACK"
            text: string
            characterId: string
          }
        | {
            id: string
            type: "EVENT_CHAT"
            text: string
            characterId: string
          }
        | {
            id: string
            type: "EVENT_SCENE"
            text: string
          }
      > = []

      if (isPlayer) {
        // プレイヤー本人: 情景のみ（セリフなし）
        logs.push({
          id: crypto.randomUUID(),
          type: "EVENT_CHAT" as const,
          text: `${attacker.name}の攻撃！ 敵に${damage}のダメージ！`,
          characterId: "",
        })
      } else {
        // 仲間: セリフと情景+ダメージの2つのイベント
        const [dialogue, scene, ...restMessages] = state.battleMessages
        const attackDialogue = dialogue || `${attacker.name}の攻撃！`
        const attackScene = scene || ""

        logs.push(
          {
            id: crypto.randomUUID(),
            type: "EVENT_PLAYER_ATTACK" as const,
            text: attackDialogue,
            characterId: attacker.id,
          },
          {
            id: crypto.randomUUID(),
            type: "EVENT_CHAT" as const,
            text: `${attackScene} 敵に${damage}のダメージ！`,
            characterId: "",
          },
        )
      }

      if (newHp <= 0) {
        logs.push({
          id: crypto.randomUUID(),
          type: "EVENT_SCENE" as const,
          text: "敵を倒した！",
        })
      }

      // HP更新してログ追加
      // 仲間の場合はAIメッセージ（dialogue + scene = 2つ）を削除
      return state
        .withUpdatedEnemy(targetEnemy.id, { hp: newHp })
        .withAddedLogs(logs)
        .withActionQueue(remainingActions)
        .withBattleMessages(isPlayer ? remainingMessages : remainingMessages.slice(2))
    }

    // ENEMY_ATTACK: 敵の攻撃を実行
    if (currentAction.type === "ENEMY_ATTACK") {
      const enemy = state.enemies.find(
        (e) => e.id === currentAction.actorEnemyId,
      )

      // 敵が死んでいたらスキップ（メッセージも削除）
      if (!enemy || enemy.hp <= 0) {
        return state
          .withActionQueue(remainingActions)
          .withBattleMessages(remainingMessages)
      }

      const allMembers = state.vault.members
      const target = allMembers.find(
        (m) => m.id === currentAction.targetCharacterId,
      )

      // ターゲットが存在しないか死んでいたらスキップ（メッセージも削除）
      if (!target || target.hp <= 0) {
        return state
          .withActionQueue(remainingActions)
          .withBattleMessages(remainingMessages)
      }

      // ダメージ計算
      const damage = Math.max(1, enemy.atk - Math.floor(target.def / 2))
      const newHp = Math.max(0, target.hp - damage)

      // AIメッセージまたはデフォルトメッセージを使用
      const attackMessage = aiMessage || "敵の反撃！"

      // ログ追加（攻撃とダメージを1つのイベントに統合）
      const logs = [
        {
          id: crypto.randomUUID(),
          type: "EVENT_ENEMY_ATTACK" as const,
          text: attackMessage,
          enemyId: enemy.id,
          damage: damage,
          targetCharacterId: target.id,
          hpBefore: target.hp,
          hpAfter: newHp,
        },
      ]

      // キャラクターのHP更新、使用したメッセージを削除
      return state
        .withUpdatedCharacter(target.id, { hp: newHp })
        .withAddedLogs(logs)
        .withActionQueue(remainingActions)
        .withBattleMessages(remainingMessages)
    }

    // END_TURN: ターン終了
    if (currentAction.type === "END_TURN") {
      return state.withNextTurn().withActionQueue(remainingActions)
    }

    return state
  }

  if (action.type === "END_COMBAT") {
    return new WizStateSceneDungeonEntity({
      type: "dungeon",
      dungeonId: state.dungeonId,
      depth: state.depth,
      time: 0,
      currentMessageIndex: 0,
      nextBattle: null,
      narrativeSettings: state.narrativeSettings,
      vault: state.vault.toObject(),
    })
  }

  if (action.type === "SET_SECRET_KEY") {
    return state.withSecretKey(action.payload)
  }

  if (action.type === "DELETE_SECRET_KEY") {
    return state.withoutSecretKey()
  }

  if (action.type === "NAVIGATE_TO_BOOK_FROM_DUNGEON") {
    return new WizStateSceneBookEntity({
      type: "book",
      bookType: "monster",
      selectedIndex: null,
      previousScene: {
        type: "dungeon-battle",
        dungeonId: state.dungeonId,
        depth: state.depth,
      },
      vault: state.vault.toObject(),
      narrativeSettings: state.narrativeSettings,
    })
  }

  return state
}
