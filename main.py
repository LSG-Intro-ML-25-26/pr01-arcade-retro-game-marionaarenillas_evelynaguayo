@namespace
class SpriteKind:
    moneda = SpriteKind.create()
    enemic = SpriteKind.create()
# Funció menú inventari
def obrir_menu():
    global pantalla, menu_obert, joc, mapa_anterior, inventari, my_menu
    cabres = 0
    cavalls = 0
    gallines = 0
    ous = 0
    pantalla = "inventari"
    menu_obert = True
    joc = False
    mapa_anterior = tilemap("""
        mapa1
        """)
    tiles.set_current_tilemap(tilemap("""
        nivel0
        """))
    scene.center_camera_at(80, 60)
    controller.move_sprite(player_sprite, 0, 0)
    inventari = [miniMenu.create_menu_item("Espada" + ("" + str(ous)), assets.image("""
            ou
            """)),
        miniMenu.create_menu_item("Pistola" + ("" + str(gallines)),
            assets.image("""
                gallina1
                """)),
        miniMenu.create_menu_item("Bomba" + ("" + str(cavalls)),
            assets.image("""
                cavall1
                """)),
        miniMenu.create_menu_item("Escudo" + ("" + str(cabres)),
            assets.image("""
                cabra1
                """))]
    my_menu = miniMenu.create_menu_from_array(inventari)
    my_menu.set_title("Inventari")
    my_menu.set_frame(assets.image("""
        menu1
        """))
    my_menu.set_position(80, 60)
    my_menu.set_style_property(miniMenu.StyleKind.SELECTED,
        miniMenu.StyleProperty.BACKGROUND,
        50)
    # B: seleccionar item i obrir trueque
    
    def on_button_pressed(selection, selectedIndex):
        global seleccionar_item, mode_trueque
        seleccionar_item = selection
        mode_trueque = "comprar"
        pause(50)
        my_menu.close()
    my_menu.on_button_pressed(controller.B, on_button_pressed)
    
    # A: tancar inventari i tornar al joc
    
    def on_button_pressed2(selection2, selectedIndex2):
        global pantalla, joc, menu_obert
        nena: Sprite = None
        pantalla = "joc"
        joc = True
        menu_obert = False
        my_menu.close()
        # Tornar al laberint
        if mapa_anterior:
            tiles.set_current_tilemap(mapa_anterior)
        controller.move_sprite(nena, 100, 100)
        scene.camera_follow_sprite(nena)
    my_menu.on_button_pressed(controller.A, on_button_pressed2)
    

def on_countdown_end():
    # Quan s'acaba el temps: comprova si s'ha arribat a la puntuació objectiu
    if score >= 500:
        game.splash("VICTORIA!", "Score: " + ("" + str(score)))
    else:
        game.splash("GAME OVER", "Score: " + ("" + str(score)))
    game.reset()
info.on_countdown_end(on_countdown_end)

def on_overlap_tile(sprite, location):
    pass
scene.on_overlap_tile(SpriteKind.player,
    sprites.dungeon.chest_closed,
    on_overlap_tile)

def start_gameplay():
    global game_state, score, game_time, player_sprite
    # Inicialitza el joc: crea el jugador, reinicia score i temporitzador
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
        player_sprite = crear_jugador_random()
def crear_jugador_random():
    global randomIndex
    randomIndex = randint(1, 4)
    if randomIndex == 1:
        return sprites.create(assets.image("""
                jugador_randoom1
                """),
            SpriteKind.player)
    elif randomIndex == 2:
        return sprites.create(assets.image("""
                jugador_randoom2
                """),
            SpriteKind.player)
    elif randomIndex == 3:
        return sprites.create(assets.image("""
                jugador_randoom3
                """),
            SpriteKind.player)
    else:
        return sprites.create(assets.image("""
                jugador_randoom4
                """),
            SpriteKind.player)
def show_main_menu():
    global game_state, main_menu
    # Mostra el menú principal i gestiona la selecció amb el botó A
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
    
    def on_button_pressed3(selection22, selectedIndex22):
        # Executa l'acció segons l'opció triada al menú principal
        main_menu.close()
        if selectedIndex22 == 0:
            show_character_select()
        elif selectedIndex22 == 1:
            game.splash("VERSUS", "Proximamente!")
            show_main_menu()
        elif selectedIndex22 == 2:
            game.splash("THE END", "Creadoras: Evelyn, Mariona")
            show_main_menu()
    main_menu.on_button_pressed(controller.A, on_button_pressed3)
    

def on_on_overlap(player22, coin):
    global score
    # Quan el jugador toca una moneda: suma puntuació, so i destrueix la moneda
    score += 1
    info.change_score_by(1)
    music.play(music.melody_playable(music.ba_ding),
        music.PlaybackMode.IN_BACKGROUND)
    sprites.destroy(coin, effects.spray, 200)
sprites.on_overlap(SpriteKind.player, SpriteKind.moneda, on_on_overlap)

def show_character_select():
    global game_state, char_menu
    # Mostra el menú per seleccionar personatge i activa l'inici de partida
    game_state = GAME_STATE_CHAR_SELECT
    sprites.destroy_all_sprites_of_kind(SpriteKind.player)
    char_menu = miniMenu.create_menu(miniMenu.create_menu_item("ANDER", assets.image("""
            jugador_vermell
            """)),
        miniMenu.create_menu_item("KIRA", assets.image("""
            jugador_kira
            """)),
        miniMenu.create_menu_item("RANDOM", assets.image("""
            jugador_randoom0
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
    
    def on_button_pressed4(selection222, selectedIndex222):
        global selected_character, mapaJoc
        # Desa el personatge seleccionat i marca que s'ha de començar el joc
        selected_character = selectedIndex222
        char_menu.close()
        sprites.destroy_all_sprites_of_kind(SpriteKind.player)
        mapaJoc = True
    char_menu.on_button_pressed(controller.A, on_button_pressed4)
    

def on_on_overlap2(player2, enemy):
    # Quan l'enemic toca el jugador: game over
    game.game_over(False)
sprites.on_overlap(SpriteKind.player, SpriteKind.enemic, on_on_overlap2)

def show_name_input():
    pass
enemic1: Sprite = None
moneda2: Sprite = None
char_menu: miniMenu.MenuSprite = None
main_menu: miniMenu.MenuSprite = None
randomIndex = 0
selected_character = 0
score = 0
mode_trueque = ""
seleccionar_item = ""
my_menu: miniMenu.MenuSprite = None
inventari: List[miniMenu.MenuItem] = []
player_sprite: Sprite = None
mapa_anterior: tiles.TileMapData = None
joc = False
menu_obert = False
pantalla = ""
mapaJoc = False
game_time = 0
GAME_STATE_MENU = 0
game_state = 0
GAME_STATE_PLAYING = 0
GAME_STATE_CHAR_SELECT = 0
randomIndex2 = 0
GAME_STATE_CHAR_SELECT = 1
GAME_STATE_NAME_INPUT = 2
GAME_STATE_PLAYING = 3
game_state = GAME_STATE_MENU
player_name = "HUNTER"
game_time = 360
mapaJoc = False
scene.set_background_color(15)
effects.star_field.start_screen_effect()
game.splash("CYBER-NEON", "VIRUS HUNT")
show_main_menu()

def on_update_interval():
    global moneda2
    # Crea una moneda cada 5 segons mentre s'està jugant
    if game_state == GAME_STATE_PLAYING:
        moneda2 = sprites.create(assets.image("""
            moneda
            """), SpriteKind.moneda)
        tiles.place_on_random_tile(moneda2, sprites.dungeon.dark_ground_center)
game.on_update_interval(5000, on_update_interval)

def on_forever():
    global mapaJoc
    # Quan s'ha triat personatge, inicia la partida i col·loca el jugador al mapa
    if mapaJoc == True:
        mapaJoc = False
        start_gameplay()
        tiles.set_current_tilemap(tilemap("""
            mapa
            """))
        tiles.place_on_random_tile(player_sprite, assets.tile("""
            stage
            """))
        controller.move_sprite(player_sprite, 100, 100)
        scene.camera_follow_sprite(player_sprite)
    pause(100)
forever(on_forever)

def on_update_interval2():
    global enemic1
    # Crea un enemic cada 30 segons i fa que persegueixi el jugador
    if game_state == GAME_STATE_PLAYING and player_sprite:
        sprites.destroy_all_sprites_of_kind(SpriteKind.enemic)
        enemic1 = sprites.create(assets.image("""
            enemic1
            """), SpriteKind.enemic)
        tiles.place_on_random_tile(enemic1, sprites.dungeon.collectible_blue_crystal)
        enemic1.follow(player_sprite, 60)
game.on_update_interval(30000, on_update_interval2)
