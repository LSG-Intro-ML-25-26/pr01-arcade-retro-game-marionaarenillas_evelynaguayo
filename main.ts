namespace SpriteKind {
    export const moneda = SpriteKind.create()
    export const enemic = SpriteKind.create()
}
info.onCountdownEnd(function () {
    // Quan s'acaba el temps: comprova si s'ha arribat a la puntuació objectiu
    if (score >= 500) {
        game.splash("VICTORIA!", "Score: " + ("" + score))
    } else {
        game.splash("GAME OVER", "Score: " + ("" + score))
    }
    game.reset()
})
function start_gameplay () {
    // Inicialitza el joc: crea el jugador, reinicia score i temporitzador
    game_state = GAME_STATE_PLAYING
    score = 0
    game_time = 180
    sprites.destroyAllSpritesOfKind(SpriteKind.Player)
    if (selected_character == 0) {
        player_sprite = sprites.create(assets.image`jugador_vermell`, SpriteKind.Player)
    } else if (selected_character == 1) {
        player_sprite = sprites.create(assets.image`jugador_kira`, SpriteKind.Player)
    } else {
        player_sprite = sprites.create(assets.image`jugador_randoom1`, SpriteKind.Player)
    }
    player_sprite.setStayInScreen(true)
    info.setScore(0)
    info.startCountdown(360)
}
function show_main_menu () {
    // Mostra el menú principal i gestiona la selecció amb el botó A
    game_state = GAME_STATE_MENU
    main_menu = miniMenu.createMenu(
    miniMenu.createMenuItem("HISTORIA"),
    miniMenu.createMenuItem("VERSUS"),
    miniMenu.createMenuItem("CREDITOS")
    )
    main_menu.setPosition(80, 60)
    main_menu.setMenuStyleProperty(miniMenu.MenuStyleProperty.Width, 80)
    main_menu.setMenuStyleProperty(miniMenu.MenuStyleProperty.Height, 50)
    main_menu.setStyleProperty(miniMenu.StyleKind.Default, miniMenu.StyleProperty.Background, 15)
    main_menu.setStyleProperty(miniMenu.StyleKind.Default, miniMenu.StyleProperty.Foreground, 1)
    main_menu.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Background, 8)
    main_menu.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Foreground, 1)
    main_menu.onButtonPressed(controller.A, function (selection2, selectedIndex2) {
        // Executa l'acció segons l'opció triada al menú principal
        main_menu.close()
        if (selectedIndex2 == 0) {
            show_character_select()
        } else if (selectedIndex2 == 1) {
            game.splash("VERSUS", "Proximamente!")
            show_main_menu()
        } else if (selectedIndex2 == 2) {
            game.splash("THE END", "Creadoras: Evelyn, Mariona")
            show_main_menu()
        }
    })
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.moneda, function (player22, coin) {
    // Quan el jugador toca una moneda: suma puntuació, so i destrueix la moneda
    score += 1
    info.changeScoreBy(1)
    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
    sprites.destroy(coin, effects.spray, 200)
})
function show_character_select () {
    // Mostra el menú per seleccionar personatge i activa l'inici de partida
    game_state = GAME_STATE_CHAR_SELECT
    sprites.destroyAllSpritesOfKind(SpriteKind.Player)
    char_menu = miniMenu.createMenu(
    miniMenu.createMenuItem("ANDER", assets.image`jugador_vermell`),
    miniMenu.createMenuItem("KIRA", assets.image`jugador_kira`),
    miniMenu.createMenuItem("RANDOM", assets.image`jugador_randoom1`)
    )
    char_menu.setPosition(80, 64)
    char_menu.setStyleProperty(miniMenu.StyleKind.Default, miniMenu.StyleProperty.Background, 15)
    char_menu.setStyleProperty(miniMenu.StyleKind.Default, miniMenu.StyleProperty.Foreground, 1)
    char_menu.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Background, 8)
    char_menu.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Foreground, 1)
    char_menu.onButtonPressed(controller.A, function (selection22, selectedIndex22) {
        // Desa el personatge seleccionat i marca que s'ha de començar el joc
        selected_character = selectedIndex22
        char_menu.close()
        sprites.destroyAllSpritesOfKind(SpriteKind.Player)
        mapaJoc = true
    })
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.enemic, function (player2, enemy) {
    // Quan l'enemic toca el jugador: game over
    game.gameOver(false)
})
function show_name_input () {
	
}
let enemic1: Sprite = null
let moneda2: Sprite = null
let char_menu: miniMenu.MenuSprite = null
let main_menu: miniMenu.MenuSprite = null
let player_sprite: Sprite = null
let selected_character = 0
let score = 0
let mapaJoc = false
let game_time = 0
let GAME_STATE_MENU = 0
let game_state = 0
let GAME_STATE_PLAYING = 0
let GAME_STATE_CHAR_SELECT = 0
GAME_STATE_CHAR_SELECT = 1
let GAME_STATE_NAME_INPUT = 2
GAME_STATE_PLAYING = 3
game_state = GAME_STATE_MENU
let player_name = "HUNTER"
game_time = 360
mapaJoc = false
scene.setBackgroundColor(15)
effects.starField.startScreenEffect()
game.splash("CYBER-NEON", "VIRUS HUNT")
show_main_menu()
game.onUpdateInterval(5000, function () {
    // Crea una moneda cada 5 segons mentre s'està jugant
    if (game_state == GAME_STATE_PLAYING) {
        moneda2 = sprites.create(assets.image`moneda`, SpriteKind.moneda)
        tiles.placeOnRandomTile(moneda2, sprites.dungeon.darkGroundCenter)
    }
})
forever(function () {
    // Quan s'ha triat personatge, inicia la partida i col·loca el jugador al mapa
    if (mapaJoc == true) {
        mapaJoc = false
        start_gameplay()
        tiles.setCurrentTilemap(tilemap`mapa`)
        tiles.placeOnRandomTile(player_sprite, assets.tile`stage`)
        controller.moveSprite(player_sprite, 100, 100)
        scene.cameraFollowSprite(player_sprite)
    }
    pause(100)
})
game.onUpdateInterval(30000, function () {
    // Crea un enemic cada 30 segons i fa que persegueixi el jugador
    if (game_state == GAME_STATE_PLAYING && player_sprite) {
        sprites.destroyAllSpritesOfKind(SpriteKind.enemic)
        enemic1 = sprites.create(assets.image`enemic1`, SpriteKind.enemic)
        tiles.placeOnRandomTile(enemic1, sprites.dungeon.collectibleBlueCrystal)
        enemic1.follow(player_sprite, 60)
    }
})
