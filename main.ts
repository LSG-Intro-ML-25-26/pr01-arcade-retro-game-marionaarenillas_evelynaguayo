info.onCountdownEnd(function () {
    if (score >= 500) {
        game.splash("VICTORIA!", "Score: " + ("" + score))
    } else {
        game.splash("GAME OVER", "Score: " + ("" + score))
    }
    game.reset()
})
function start_gameplay () {
    game_state = GAME_STATE_PLAYING
    score = 0
    game_time = 180
    sprites.destroyAllSpritesOfKind(SpriteKind.Player)
    if (selected_character == 0) {
        player_sprite = sprites.create(assets.image`jugador_vermell`, SpriteKind.Player)
    } else if (selected_character == 1) {
        player_sprite = sprites.create(assets.image`jugador_kira`, SpriteKind.Player)
    } else {
        player_sprite = sprites.create(assets.image`jugador_randoom`, SpriteKind.Player)
    }
    player_sprite.setStayInScreen(true)
    info.setScore(0)
    info.startCountdown(180)
}
function show_main_menu () {
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
function show_character_select () {
    game_state = GAME_STATE_CHAR_SELECT
    sprites.destroyAllSpritesOfKind(SpriteKind.Player)
    char_menu = miniMenu.createMenu(
    miniMenu.createMenuItem("ANDER", assets.image`jugador_vermell`),
    miniMenu.createMenuItem("KIRA", assets.image`jugador_kira`),
    miniMenu.createMenuItem("RANDOM", assets.image`jugador_randoom`)
    )
    char_menu.setPosition(80, 64)
    char_menu.setStyleProperty(miniMenu.StyleKind.Default, miniMenu.StyleProperty.Background, 15)
    char_menu.setStyleProperty(miniMenu.StyleKind.Default, miniMenu.StyleProperty.Foreground, 1)
    char_menu.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Background, 8)
    char_menu.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Foreground, 1)
    char_menu.onButtonPressed(controller.A, function (selection22, selectedIndex22) {
        selected_character = selectedIndex22
        char_menu.close()
        sprites.destroyAllSpritesOfKind(SpriteKind.Player)
        mapaJoc = true
    })
}
function show_name_input () {
    game_state = GAME_STATE_NAME_INPUT
    name_menu = miniMenu.createMenu(
    miniMenu.createMenuItem("HUNTER"),
    miniMenu.createMenuItem("CYBER"),
    miniMenu.createMenuItem("NEON"),
    miniMenu.createMenuItem("GLITCH"),
    miniMenu.createMenuItem("SHADOW")
    )
    name_menu.setPosition(80, 60)
    name_menu.setMenuStyleProperty(miniMenu.MenuStyleProperty.Width, 80)
    name_menu.setMenuStyleProperty(miniMenu.MenuStyleProperty.Height, 70)
    name_menu.setStyleProperty(miniMenu.StyleKind.Default, miniMenu.StyleProperty.Background, 15)
    name_menu.setStyleProperty(miniMenu.StyleKind.Default, miniMenu.StyleProperty.Foreground, 1)
    name_menu.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Background, 8)
    name_menu.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Foreground, 1)
    name_menu.onButtonPressed(controller.A, function (selection3, selectedIndex3) {
        names = [
        "HUNTER",
        "CYBER",
        "NEON",
        "GLITCH",
        "SHADOW"
        ]
        player_name = names[selectedIndex3]
        name_menu.close()
    })
}
let names: string[] = []
let name_menu: miniMenu.MenuSprite = null
let char_menu: miniMenu.MenuSprite = null
let main_menu: miniMenu.MenuSprite = null
let player_sprite: Sprite = null
let selected_character = 0
let score = 0
let mapaJoc = false
let game_time = 0
let player_name = ""
let GAME_STATE_MENU = 0
let game_state = 0
let GAME_STATE_PLAYING = 0
let GAME_STATE_NAME_INPUT = 0
let GAME_STATE_CHAR_SELECT = 0
GAME_STATE_CHAR_SELECT = 1
GAME_STATE_NAME_INPUT = 2
GAME_STATE_PLAYING = 3
game_state = GAME_STATE_MENU
player_name = "HUNTER"
game_time = 180
mapaJoc = false
scene.setBackgroundColor(15)
effects.starField.startScreenEffect()
game.splash("CYBER-NEON", "VIRUS HUNT")
show_main_menu()
forever(function () {
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
