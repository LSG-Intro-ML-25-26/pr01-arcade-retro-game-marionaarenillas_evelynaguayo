info.onCountdownEnd(function on_countdown_end() {
    if (score >= 500) {
        game.splash("VICTORIA!", "Score: " + ("" + ("" + score)))
    } else {
        game.splash("GAME OVER", "Score: " + ("" + ("" + score)))
    }
    
    game.reset()
})
function start_gameplay() {
    
    game_state = GAME_STATE_PLAYING
    score = 0
    game_time = 180
    sprites.destroyAllSpritesOfKind(SpriteKind.Player)
    if (selected_character == 0) {
        player_sprite = sprites.create(assets.image`
            ander_idle
            `, SpriteKind.Player)
    } else if (selected_character == 1) {
        player_sprite = sprites.create(assets.image`
            kira_idle
            `, SpriteKind.Player)
    } else {
        player_sprite = sprites.create(assets.image`
            random_idle
            `, SpriteKind.Player)
    }
    
    player_sprite.setPosition(80, 60)
    player_sprite.setStayInScreen(true)
    controller.moveSprite(player_sprite, 100, 100)
    info.setScore(0)
    info.startCountdown(180)
}

function show_main_menu() {
    
    game_state = GAME_STATE_MENU
    main_menu = miniMenu.createMenu(miniMenu.createMenuItem("HISTORIA"), miniMenu.createMenuItem("VERSUS"), miniMenu.createMenuItem("CREDITOS"))
    main_menu.setPosition(80, 60)
    main_menu.setMenuStyleProperty(miniMenu.MenuStyleProperty.Width, 80)
    main_menu.setMenuStyleProperty(miniMenu.MenuStyleProperty.Height, 50)
    main_menu.setStyleProperty(miniMenu.StyleKind.Default, miniMenu.StyleProperty.Background, 15)
    main_menu.setStyleProperty(miniMenu.StyleKind.Default, miniMenu.StyleProperty.Foreground, 1)
    main_menu.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Background, 8)
    main_menu.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Foreground, 1)
    main_menu.onButtonPressed(controller.A, function on_button_pressed(selection: any, selectedIndex: any) {
        main_menu.close()
        if (selectedIndex == 0) {
            show_character_select()
        } else if (selectedIndex == 1) {
            game.splash("VERSUS", "Proximamente!")
            show_main_menu()
        } else if (selectedIndex == 2) {
            game.splash("CYBER-NEON", "Creado por New")
            show_main_menu()
        }
        
    })
}

function show_character_select() {
    
    game_state = GAME_STATE_CHAR_SELECT
    sprites.destroyAllSpritesOfKind(SpriteKind.Player)
    ander_preview = sprites.create(assets.image`jugador_vermell`, SpriteKind.Player)
    ander_preview.setPosition(40, 50)
    kira_preview = sprites.create(assets.image`jugador_vermell`, SpriteKind.Player)
    kira_preview.setPosition(80, 50)
    random_preview = sprites.create(assets.image`jugador_vermell`, SpriteKind.Player)
    random_preview.setPosition(120, 50)
    char_menu = miniMenu.createMenu(miniMenu.createMenuItem("ANDER"), miniMenu.createMenuItem("KIRA"), miniMenu.createMenuItem("RANDOM"))
    char_menu.setPosition(80, 100)
    char_menu.setMenuStyleProperty(miniMenu.MenuStyleProperty.Width, 100)
    char_menu.setMenuStyleProperty(miniMenu.MenuStyleProperty.Height, 30)
    char_menu.setStyleProperty(miniMenu.StyleKind.Default, miniMenu.StyleProperty.Background, 15)
    char_menu.setStyleProperty(miniMenu.StyleKind.Default, miniMenu.StyleProperty.Foreground, 1)
    char_menu.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Background, 8)
    char_menu.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Foreground, 1)
    char_menu.onButtonPressed(controller.A, function on_button_pressed2(selection2: any, selectedIndex2: number) {
        
        selected_character = selectedIndex2
        char_menu.close()
        sprites.destroyAllSpritesOfKind(SpriteKind.Player)
        show_name_input()
    })
}

function show_name_input() {
    
    game_state = GAME_STATE_NAME_INPUT
    name_menu = miniMenu.createMenu(miniMenu.createMenuItem("HUNTER"), miniMenu.createMenuItem("CYBER"), miniMenu.createMenuItem("NEON"), miniMenu.createMenuItem("GLITCH"), miniMenu.createMenuItem("SHADOW"))
    name_menu.setPosition(80, 60)
    name_menu.setMenuStyleProperty(miniMenu.MenuStyleProperty.Width, 80)
    name_menu.setMenuStyleProperty(miniMenu.MenuStyleProperty.Height, 70)
    name_menu.setStyleProperty(miniMenu.StyleKind.Default, miniMenu.StyleProperty.Background, 15)
    name_menu.setStyleProperty(miniMenu.StyleKind.Default, miniMenu.StyleProperty.Foreground, 1)
    name_menu.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Background, 8)
    name_menu.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Foreground, 1)
    name_menu.onButtonPressed(controller.A, function on_button_pressed3(selection3: any, selectedIndex3: number) {
        
        names = ["HUNTER", "CYBER", "NEON", "GLITCH", "SHADOW"]
        player_name = names[selectedIndex3]
        name_menu.close()
        start_gameplay()
    })
}

let names : string[] = []
let name_menu : miniMenu.MenuSprite = null
let char_menu : miniMenu.MenuSprite = null
let random_preview : Sprite = null
let kira_preview : Sprite = null
let ander_preview : Sprite = null
let main_menu : miniMenu.MenuSprite = null
let player_sprite : Sprite = null
let selected_character = 0
let score = 0
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
scene.setBackgroundColor(15)
game.splash("CYBER-NEON", "VIRUS HUNT")
show_main_menu()
