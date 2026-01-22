def on_countdown_end():
    if score >= 500:
        game.splash("VICTORIA!", "Score: " + ("" + str(score)))
    else:
        game.splash("GAME OVER", "Score: " + ("" + str(score)))
    game.reset()
info.on_countdown_end(on_countdown_end)

def start_gameplay():
    global game_state, score, game_time, player_sprite
    game_state = GAME_STATE_PLAYING
    score = 0
    game_time = 180
    sprites.destroy_all_sprites_of_kind(SpriteKind.player)
    if selected_character == 0:
        player_sprite = sprites.create(assets.image("""
                jugador_vermell
                """),
            SpriteKind.player)
    elif selected_character == 1:
        player_sprite = sprites.create(assets.image("""
                jugador_kira
                """),
            SpriteKind.player)
    else:
        player_sprite = sprites.create(assets.image("""
                jugador_randoom
                """),
            SpriteKind.player)
    player_sprite.set_position(80, 60)
    player_sprite.set_stay_in_screen(True)
    controller.move_sprite(player_sprite, 100, 100)
    info.set_score(0)
    info.start_countdown(180)
def show_main_menu():
    global game_state, main_menu
    game_state = GAME_STATE_MENU
    main_menu = miniMenu.create_menu(miniMenu.create_menu_item("HISTORIA"),
        miniMenu.create_menu_item("VERSUS"),
        miniMenu.create_menu_item("CREDITOS"))
    main_menu.set_position(80, 60)
    main_menu.set_menu_style_property(miniMenu.MenuStyleProperty.WIDTH, 80)
    main_menu.set_menu_style_property(miniMenu.MenuStyleProperty.HEIGHT, 50)
    main_menu.set_style_property(miniMenu.StyleKind.DEFAULT,
        miniMenu.StyleProperty.BACKGROUND,
        15)
    main_menu.set_style_property(miniMenu.StyleKind.DEFAULT,
        miniMenu.StyleProperty.FOREGROUND,
        1)
    main_menu.set_style_property(miniMenu.StyleKind.SELECTED,
        miniMenu.StyleProperty.BACKGROUND,
        8)
    main_menu.set_style_property(miniMenu.StyleKind.SELECTED,
        miniMenu.StyleProperty.FOREGROUND,
        1)
    
    def on_button_pressed(selection2, selectedIndex2):
        main_menu.close()
        if selectedIndex2 == 0:
            show_character_select()
        elif selectedIndex2 == 1:
            game.splash("VERSUS", "Proximamente!")
            show_main_menu()
        elif selectedIndex2 == 2:
            game.splash("THE END", "Creadoras: Evelyn, Mariona")
            show_main_menu()
    main_menu.on_button_pressed(controller.A, on_button_pressed)
    
def show_character_select():
    global game_state, char_menu
    game_state = GAME_STATE_CHAR_SELECT
    sprites.destroy_all_sprites_of_kind(SpriteKind.player)
    char_menu = miniMenu.create_menu(miniMenu.create_menu_item("ANDER", assets.image("""
            jugador_vermell
            """)),
        miniMenu.create_menu_item("KIRA", assets.image("""
            jugador_kira
            """)),
        miniMenu.create_menu_item("RANDOM", assets.image("""
            jugador_randoom
            """)))
    char_menu.set_position(80, 64)
    char_menu.set_style_property(miniMenu.StyleKind.DEFAULT,
        miniMenu.StyleProperty.BACKGROUND,
        15)
    char_menu.set_style_property(miniMenu.StyleKind.DEFAULT,
        miniMenu.StyleProperty.FOREGROUND,
        1)
    char_menu.set_style_property(miniMenu.StyleKind.SELECTED,
        miniMenu.StyleProperty.BACKGROUND,
        8)
    char_menu.set_style_property(miniMenu.StyleKind.SELECTED,
        miniMenu.StyleProperty.FOREGROUND,
        1)
    
    def on_button_pressed2(selection22, selectedIndex22):
        global selected_character, mapaJoc
        selected_character = selectedIndex22
        char_menu.close()
        sprites.destroy_all_sprites_of_kind(SpriteKind.player)
        mapaJoc = True
    char_menu.on_button_pressed(controller.A, on_button_pressed2)
    
def show_name_input():
    global game_state, name_menu
    game_state = GAME_STATE_NAME_INPUT
    name_menu = miniMenu.create_menu(miniMenu.create_menu_item("HUNTER"),
        miniMenu.create_menu_item("CYBER"),
        miniMenu.create_menu_item("NEON"),
        miniMenu.create_menu_item("GLITCH"),
        miniMenu.create_menu_item("SHADOW"))
    name_menu.set_position(80, 60)
    name_menu.set_menu_style_property(miniMenu.MenuStyleProperty.WIDTH, 80)
    name_menu.set_menu_style_property(miniMenu.MenuStyleProperty.HEIGHT, 70)
    name_menu.set_style_property(miniMenu.StyleKind.DEFAULT,
        miniMenu.StyleProperty.BACKGROUND,
        15)
    name_menu.set_style_property(miniMenu.StyleKind.DEFAULT,
        miniMenu.StyleProperty.FOREGROUND,
        1)
    name_menu.set_style_property(miniMenu.StyleKind.SELECTED,
        miniMenu.StyleProperty.BACKGROUND,
        8)
    name_menu.set_style_property(miniMenu.StyleKind.SELECTED,
        miniMenu.StyleProperty.FOREGROUND,
        1)
    
    def on_button_pressed3(selection3, selectedIndex3):
        global names, player_name
        names = ["HUNTER", "CYBER", "NEON", "GLITCH", "SHADOW"]
        player_name = names[selectedIndex3]
        name_menu.close()
    name_menu.on_button_pressed(controller.A, on_button_pressed3)
    
names: List[str] = []
name_menu: miniMenu.MenuSprite = None
char_menu: miniMenu.MenuSprite = None
main_menu: miniMenu.MenuSprite = None
player_sprite: Sprite = None
selected_character = 0
score = 0
mapaJoc = False
game_time = 0
player_name = ""
GAME_STATE_MENU = 0
game_state = 0
GAME_STATE_PLAYING = 0
GAME_STATE_NAME_INPUT = 0
GAME_STATE_CHAR_SELECT = 0
GAME_STATE_CHAR_SELECT = 1
GAME_STATE_NAME_INPUT = 2
GAME_STATE_PLAYING = 3
game_state = GAME_STATE_MENU
player_name = "HUNTER"
game_time = 180
mapaJoc = False
scene.set_background_color(15)
effects.star_field.start_screen_effect()
game.splash("CYBER-NEON", "VIRUS HUNT")
show_main_menu()

def on_forever():
    if mapaJoc == True:
        tiles.set_current_tilemap(tilemap("""
            mapa0
            """))
        controller.move_sprite(player_sprite, 100, 100)
        scene.camera_follow_sprite(player_sprite)
        tiles.place_on_random_tile(player_sprite, assets.tile("""
            stage
            """))
        start_gameplay()
    pause(100)
forever(on_forever)
