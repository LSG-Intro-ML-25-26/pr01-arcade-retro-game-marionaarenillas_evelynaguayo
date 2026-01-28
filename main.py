@namespace
class SpriteKind:
    moneda = SpriteKind.create()
    enemic = SpriteKind.create()
    NPC_Doctor = SpriteKind.create()
    NPC_Girl = SpriteKind.create()
    NPC_Prisoner = SpriteKind.create()
    NPC_Jigsaw = SpriteKind.create()
    Complete = SpriteKind.create()
    Dead = SpriteKind.create()

def configuracion_partida():
    global menu_configuracio, menu
    menu_configuracio = miniMenu.create_menu(miniMenu.create_menu_item("Tiempo Partida"),
        miniMenu.create_menu_item("Dificultad"),
        miniMenu.create_menu_item("Volver"))
    menu = menu_configuracio
    estructura_menus()
    
    def on_button_pressed(selection, selectedIndex):
        menu_configuracio.close()
        if selectedIndex == 0:
            menu_temps2()
        elif selectedIndex == 1:
            menu_dificultad2()
        else:
            show_main_menu()
    menu_configuracio.on_button_pressed(controller.A, on_button_pressed)
    
def show_character_story():
    global game_state
    game_state = GAME_STATE_CHAR_STORY
    scene.set_background_color(0)
    if selected_character == 0:
        game.splash("ANDER", "Vi a un hombre morir... y no hice nada.")
    elif selected_character == 1:
        game.splash("KIRA", "Manipulé y destruí vidas sin remordimiento.")
    else:
        game.splash("RANDOM", "Siempre fui indiferente al sufrimiento.")
    pause(1000)
    game.show_long_text("Y entonces... todo se volvió negro.", DialogLayout.BOTTOM)
    pause(1000)
    show_jigsaw_message()
def inventari_armes():
    global pantalla, mapaJoc, inventari_obert, mapa_anterior, inventari_armes2, my_menu
    escudo = 0
    pistola = 0
    espada = 0
    pantalla = "inventari"
    mapaJoc = False
    inventari_obert = True
    mapa_anterior = tilemap("""
        mapa
        """)
    scene.center_camera_at(80, 60)
    controller.move_sprite(player_sprite, 0, 0)
    inventari_armes2 = [miniMenu.create_menu_item("Espada " + ("" + str(espada)),
            assets.image("""
                espada
                """)),
        miniMenu.create_menu_item("Pistola " + ("" + str(pistola)),
            assets.image("""
                pistola
                """)),
        miniMenu.create_menu_item("Escudo temporal " + ("" + str(escudo)),
            assets.image("""
                escudo
                """))]
    my_menu = miniMenu.create_menu_from_array(inventari_armes2)
    my_menu.set_title("Inventari")
    my_menu.set_frame(assets.image("""
        mapa_inventari
        """))
    my_menu.set_position(80, 60)
    my_menu.set_style_property(miniMenu.StyleKind.SELECTED,
        miniMenu.StyleProperty.BACKGROUND,
        54)
    
    def on_button_pressed2(selection2, selectedIndex2):
        global inventari_obert, pantalla, game_state
        inventari_obert = False
        pantalla = "joc"
        game_state = GAME_STATE_PLAYING
        my_menu.close()
        tiles.set_current_tilemap(mapa_anterior)
        tiles.place_on_random_tile(player_sprite, sprites.dungeon.chest_open)
        scene.camera_follow_sprite(player_sprite)
        controller.move_sprite(player_sprite, 100, 100)
    my_menu.on_button_pressed(controller.A, on_button_pressed2)
    

def on_on_overlap(sprite, otherSprite):
    global is_player_talking, npcs_saved, npcs_dead
    if is_player_talking or girl_npc.kind() == SpriteKind.Complete or girl_npc.kind() == SpriteKind.Dead:
        return
    if controller.A.is_pressed():
        is_player_talking = True
        game.splash("NIÑA", "Me envenenaron... ¿Me salvas?")
        respuesta2 = game.ask("¿Buscar antídoto?", "A=SÍ, B=NO")
        if respuesta2:
            game.splash("NIÑA", "¡Gracias por salvarme!")
            girl_npc.set_kind(SpriteKind.Complete)
            info.change_score_by(200)
            npcs_saved += 1
        else:
            game.splash("...", "*La niña muere*")
            girl_npc.destroy()
            npcs_dead += 1
            info.change_score_by(-100)
        is_player_talking = False
sprites.on_overlap(SpriteKind.player, SpriteKind.NPC_Girl, on_on_overlap)

def spawn_npcs_in_map():
    global doctor_npc, girl_npc, prisoner_npc
    # NPCs en diferentes tiles del mapa
    doctor_npc = sprites.create(assets.image("""
            jugador_vermell
            """),
        SpriteKind.NPC_Doctor)
    tiles.place_on_random_tile(doctor_npc, assets.tile("""
        transparency16
        """))
    girl_npc = sprites.create(assets.image("""
            jugador_kira
            """),
        SpriteKind.NPC_Girl)
    tiles.place_on_random_tile(girl_npc, assets.tile("""
        transparency16
        """))
    prisoner_npc = sprites.create(assets.image("""
            jugador_randoom0
            """),
        SpriteKind.NPC_Prisoner)
    tiles.place_on_random_tile(prisoner_npc, assets.tile("""
        transparency16
        """))

def on_on_overlap2(sprite2, otherSprite2):
    global is_player_talking, npcs_saved, npcs_dead
    if is_player_talking or doctor_npc.kind() == SpriteKind.Complete or doctor_npc.kind() == SpriteKind.Dead:
        return
    if controller.A.is_pressed():
        is_player_talking = True
        game.splash("DOCTOR", "¡Bomba en el pecho! ¿Me ayudas?")
        respuesta = game.ask("¿Ayudarlo?", "A=SÍ, B=NO")
        if respuesta:
            game.splash("DOCTOR", "¡Gracias! ¡Salvaste mi vida!")
            doctor_npc.set_kind(SpriteKind.Complete)
            info.change_score_by(150)
            npcs_saved += 1
        else:
            game.splash("", "*EXPLOSIÓN*")
            doctor_npc.destroy()
            npcs_dead += 1
            info.change_score_by(-50)
        is_player_talking = False
sprites.on_overlap(SpriteKind.player, SpriteKind.NPC_Doctor, on_on_overlap2)


def on_down_pressed():
    if game_state == GAME_STATE_PLAYING and player_sprite:
        if selected_character == 0:
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    jugadorvermell_bajar
                    """),
                500,
                True)
        elif selected_character == 1:
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    jugadorkira_bajar
                    """),
                500,
                True)
        elif randomIndex == 1:
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    jugadorrandoomlila_bajar
                    """),
                500,
                True)
        elif randomIndex == 2:
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    jugadorrandoomrosa_bajar
                    """),
                500,
                True)
        elif randomIndex == 3:
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    jugadorrandoomgroc_bajar
                    """),
                500,
                True)
        else:
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    jugadorrandoommarro_bajar
                    """),
                500,
                True)
controller.down.on_event(ControllerButtonEvent.PRESSED, on_down_pressed)

def menu_temps2():
    global menu_temps, menu
    menu_temps = miniMenu.create_menu(miniMenu.create_menu_item("3 minutos"),
        miniMenu.create_menu_item("5 minutos"),
        miniMenu.create_menu_item("7 minutos"),
        miniMenu.create_menu_item("Volver"))
    menu = menu_temps
    estructura_menus()
    
    def on_button_pressed3(selection3, selectedIndex3):
        global duracion_partida
        menu_temps.close()
        if selectedIndex3 == 0:
            duracion_partida = 180
            game.splash("Tiempo seleccionado: 3 minutos")
            configuracion_partida()
        elif selectedIndex3 == 1:
            duracion_partida = 300
            game.splash("Tiempo seleccionado: 5 minutos")
            configuracion_partida()
        elif selectedIndex3 == 2:
            duracion_partida = 420
            game.splash("Tiempo seleccionado: 7 minutos")
            configuracion_partida()
        else:
            configuracion_partida()
    menu_temps.on_button_pressed(controller.A, on_button_pressed3)
    
def spawner_enemics():
    global ultimo_enemigo2, enemic1
    if game_state != GAME_STATE_PLAYING or not (player_sprite):
        return
    if len(sprites.all_of_kind(SpriteKind.enemic)) >= max_enemics:
        return
    if game.runtime() - ultimo_enemigo2 < enemigos_intervalo:
        return
    ultimo_enemigo2 = game.runtime()
    enemic1 = sprites.create(assets.image("""
        enemic1
        """), SpriteKind.enemic)
    tiles.place_on_random_tile(enemic1, sprites.dungeon.collectible_blue_crystal)
    enemic1.follow(player_sprite, velocidad_enemigo)
# ========== INTRO SIMPLIFICADA DE JIGSAW ==========
def show_saw_intro():
    scene.set_background_color(0)
    game.show_long_text("Hola... Quiero jugar un juego.", DialogLayout.CENTER)
    pause(2000)
    game.show_long_text("Has ignorado el sufrimiento ajeno.", DialogLayout.CENTER)
    pause(2000)
    game.show_long_text("Ahora deberás demostrar que valoras la vida.",
        DialogLayout.CENTER)
    pause(2000)
    game.show_long_text("Tienes 180 segundos.", DialogLayout.CENTER)
    pause(2000)
    game.show_long_text("Vive o muere. Haz tu elección.", DialogLayout.CENTER)
    pause(2000)
    scene.set_background_color(2)
    game.splash("LAS PRUEBAS DE", "JIGSAW")
    pause(1000)

def on_right_pressed():
    if game_state == GAME_STATE_PLAYING and player_sprite:
        if selected_character == 0:
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    jugadorvermell_dreta
                    """),
                500,
                True)
        elif selected_character == 1:
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    jugadorkira_derecha
                    """),
                500,
                True)
        elif randomIndex == 1:
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    jugadorrandoomlila_derecha
                    """),
                500,
                True)
        elif randomIndex == 2:
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    jugadorrandoomrosa_derecha
                    """),
                500,
                True)
        elif randomIndex == 3:
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    jugadorrandoomgroc_derecha0
                    """),
                500,
                True)
        else:
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    jugadorrandoommarro_derecha
                    """),
                500,
                True)
controller.right.on_event(ControllerButtonEvent.PRESSED, on_right_pressed)

def on_left_pressed():
    if game_state == GAME_STATE_PLAYING and player_sprite:
        if selected_character == 0:
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    jugadorvermell_esquerra
                    """),
                500,
                True)
        elif selected_character == 1:
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    jugadorkira_esquerra
                    """),
                500,
                True)
        elif randomIndex == 1:
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    jugadorrandoomlila_esquerra
                    """),
                500,
                True)
        elif randomIndex == 2:
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    jugadorrandoomrosa_esquerra
                    """),
                500,
                True)
        elif randomIndex == 3:
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    jugadorrandoomgroc_esquerra
                    """),
                500,
                True)
        else:
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    jugadorrandoommarro_esquerra0
                    """),
                500,
                True)
controller.left.on_event(ControllerButtonEvent.PRESSED, on_left_pressed)


def on_countdown_end():
    scene.set_background_color(0)
    if score >= 500 and npcs_dead == 0:
        game.splash("JIGSAW", "Impresionante. Eres libre.")
        game.splash("FINAL PERFECTO", "Score: " + ("" + str(score)))
    elif score >= 300:
        game.splash("JIGSAW", "Sobreviviste... pero a qué costo.")
        game.splash("FINAL BUENO", "Score: " + ("" + str(score)))
    else:
        game.splash("JIGSAW", "Fallaste.")
        game.splash("GAME OVER", "Score: " + ("" + str(score)))
    game.reset()
info.on_countdown_end(on_countdown_end)

def on_on_overlap3(sprite3, otherSprite3):
    global is_player_talking, npcs_saved, npcs_dead
    if is_player_talking or prisoner_npc.kind() == SpriteKind.Complete or prisoner_npc.kind() == SpriteKind.Dead:
        return
    if controller.A.is_pressed():
        is_player_talking = True
        game.splash("PRISIONERO", "Cadenas apretando... ¿Ayuda?")
        respuesta3 = game.ask("¿Liberarlo?", "A=SÍ, B=NO")
        if respuesta3:
            game.splash("PRISIONERO", "¡Libre! ¡Gracias!")
            prisoner_npc.set_kind(SpriteKind.Complete)
            info.change_score_by(150)
            npcs_saved += 1
        else:
            game.splash("...", "*Aplastado*")
            prisoner_npc.destroy()
            npcs_dead += 1
            info.change_score_by(-50)
        is_player_talking = False
sprites.on_overlap(SpriteKind.player, SpriteKind.NPC_Prisoner, on_on_overlap3)

def on_overlap_tile(sprite4, location):
    if pantalla == "joc":
        inventari_armes()
scene.on_overlap_tile(SpriteKind.player,
    sprites.dungeon.chest_closed,
    on_overlap_tile)

def start_gameplay():
    global ultimo_enemigo, game_state, score, game_time, player_sprite
    ultimo_enemigo = game.runtime()
    info.start_countdown(duracion_partida)
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
    # Spawear NPCs en el mapa
    spawn_npcs_in_map()
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
def menu_dificultad2():
    global menu_dificultad, menu
    menu_dificultad = miniMenu.create_menu(miniMenu.create_menu_item("Fácil"),
        miniMenu.create_menu_item("Difícil"),
        miniMenu.create_menu_item("Volver"))
    menu = menu_dificultad
    estructura_menus()
    
    def on_button_pressed4(selection4, selectedIndex4):
        global dificultad, enemigos_intervalo, velocidad_enemigo, max_enemics
        menu_dificultad.close()
        if selectedIndex4 == 0:
            dificultad = "FACIL"
            enemigos_intervalo = 30000
            velocidad_enemigo = 55
            max_enemics = 6
            game.show_long_text("MODO FÁCIL: Enemigos cada 30s, velocidad baja, máximo 6 enemigos",
                DialogLayout.BOTTOM)
            configuracion_partida()
        elif selectedIndex4 == 1:
            dificultad = "DIFICIL"
            enemigos_intervalo = 15000
            velocidad_enemigo = 85
            max_enemics = 10
            game.show_long_text("MODO DIFÍCIL: Enemigos cada 15s, velocidad alta, máximo 10 enemigos",
                DialogLayout.BOTTOM)
            configuracion_partida()
        elif selectedIndex4 == 2:
            configuracion_partida()
    menu_dificultad.on_button_pressed(controller.A, on_button_pressed4)
    

def on_up_pressed():
    if game_state == GAME_STATE_PLAYING and player_sprite:
        if selected_character == 0:
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    jugadorvermell_subir0
                    """),
                500,
                True)
        elif selected_character == 1:
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    jugadorkira_subir
                    """),
                500,
                True)
        elif randomIndex == 1:
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    jugadorrandoom1_subir
                    """),
                500,
                True)
        elif randomIndex == 2:
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    jugadorrandoomrosa_subir
                    """),
                500,
                True)
        elif randomIndex == 3:
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    jugadorrandoomgroc_subir
                    """),
                500,
                True)
        else:
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    jugadorrandoommarro_subir
                    """),
                500,
                True)
controller.up.on_event(ControllerButtonEvent.PRESSED, on_up_pressed)

def show_main_menu():
    global game_state, main_menu, menu
    GAME_STATE_MENU = 0
    game_state = GAME_STATE_MENU
    scene.set_background_color(0)
    main_menu = miniMenu.create_menu(miniMenu.create_menu_item("HISTORIA"),
        miniMenu.create_menu_item("CONFIGURACIÓN"),
        miniMenu.create_menu_item("VERSUS"),
        miniMenu.create_menu_item("CREDITOS"))
    menu = main_menu
    estructura_menus()
    # Colores SAW
    main_menu.set_style_property(miniMenu.StyleKind.DEFAULT,
        miniMenu.StyleProperty.BACKGROUND,
        2)
    main_menu.set_style_property(miniMenu.StyleKind.DEFAULT,
        miniMenu.StyleProperty.FOREGROUND,
        0)
    main_menu.set_style_property(miniMenu.StyleKind.SELECTED,
        miniMenu.StyleProperty.BACKGROUND,
        15)
    main_menu.set_style_property(miniMenu.StyleKind.SELECTED,
        miniMenu.StyleProperty.FOREGROUND,
        2)
    
    def on_button_pressed5(selection22, selectedIndex22):
        main_menu.close()
        if selectedIndex22 == 0:
            show_character_select()
        elif selectedIndex22 == 1:
            game.splash("CONFIGURACIÓN")
            configuracion_partida()
        elif selectedIndex22 == 2:
            game.splash("VERSUS", "Proximamente!")
            show_main_menu()
        elif selectedIndex22 == 3:
            game.splash("LAS PRUEBAS DE JIGSAW", "Creado por New")
            show_main_menu()
    main_menu.on_button_pressed(controller.A, on_button_pressed5)
    

def on_on_overlap4(player22, coin):
    global score
    score += 1
    info.change_score_by(1)
    music.play(music.melody_playable(music.ba_ding),
        music.PlaybackMode.IN_BACKGROUND)
    sprites.destroy(coin, effects.spray, 200)
sprites.on_overlap(SpriteKind.player, SpriteKind.moneda, on_on_overlap4)

def show_character_select():
    global game_state, char_menu
    game_state = GAME_STATE_CHAR_SELECT
    sprites.destroy_all_sprites_of_kind(SpriteKind.player)
    char_menu = miniMenu.create_menu(miniMenu.create_menu_item("ANDER - El Cobarde",
            assets.image("""
                jugador_vermell
                """)),
        miniMenu.create_menu_item("KIRA - La Manipuladora",
            assets.image("""
                jugador_kira
                """)),
        miniMenu.create_menu_item("RANDOM - El Indiferente",
            assets.image("""
                jugador_randoom0
                """)))
    char_menu.set_position(80, 64)
    char_menu.set_style_property(miniMenu.StyleKind.DEFAULT,
        miniMenu.StyleProperty.BACKGROUND,
        2)
    char_menu.set_style_property(miniMenu.StyleKind.DEFAULT,
        miniMenu.StyleProperty.FOREGROUND,
        0)
    char_menu.set_style_property(miniMenu.StyleKind.SELECTED,
        miniMenu.StyleProperty.BACKGROUND,
        15)
    char_menu.set_style_property(miniMenu.StyleKind.SELECTED,
        miniMenu.StyleProperty.FOREGROUND,
        2)
    
    def on_button_pressed6(selection222, selectedIndex222):
        global selected_character
        selected_character = selectedIndex222
        char_menu.close()
        sprites.destroy_all_sprites_of_kind(SpriteKind.player)
        show_character_story()
    char_menu.on_button_pressed(controller.A, on_button_pressed6)
    
def show_jigsaw_message():
    global game_state, character_names, char_name, mapaJoc
    game_state = GAME_STATE_JIGSAW_MESSAGE
    scene.set_background_color(0)
    character_names = ["Ander", "Kira", "Random"]
    char_name = character_names[selected_character]
    game.splash("JIGSAW", "Hola, " + char_name + ".")
    game.splash("JIGSAW", "Tienes 180 segundos para redimirte.")
    game.splash("JIGSAW", "Salva a los inocentes atrapados.")
    pause(1000)
    game.show_long_text("Vive o muere. Haz tu elección.", DialogLayout.CENTER)
    pause(1000)
    # Inicia el juego
    mapaJoc = True

def on_on_overlap5(player2, enemy):
    game.game_over(False)
sprites.on_overlap(SpriteKind.player, SpriteKind.enemic, on_on_overlap5)

def estructura_menus():
    main_menu.set_position(80, 60)
    menu.set_menu_style_property(miniMenu.MenuStyleProperty.WIDTH, 120)
    menu.set_menu_style_property(miniMenu.MenuStyleProperty.HEIGHT, 60)
    menu.set_style_property(miniMenu.StyleKind.DEFAULT,
        miniMenu.StyleProperty.BACKGROUND,
        15)
    menu.set_style_property(miniMenu.StyleKind.DEFAULT,
        miniMenu.StyleProperty.FOREGROUND,
        1)
    menu.set_style_property(miniMenu.StyleKind.SELECTED,
        miniMenu.StyleProperty.BACKGROUND,
        8)
    menu.set_style_property(miniMenu.StyleKind.SELECTED,
        miniMenu.StyleProperty.FOREGROUND,
        1)
moneda2: Sprite = None
char_name = ""
character_names: List[str] = []
char_menu: miniMenu.MenuSprite = None
main_menu: miniMenu.MenuSprite = None
menu_dificultad: miniMenu.MenuSprite = None
ultimo_enemigo = 0
score = 0
enemic1: Sprite = None
ultimo_enemigo2 = 0
menu_temps: miniMenu.MenuSprite = None
randomIndex = 0
prisoner_npc: Sprite = None
doctor_npc: Sprite = None
npcs_dead = 0
npcs_saved = 0
girl_npc: Sprite = None
is_player_talking = False
my_menu: miniMenu.MenuSprite = None
inventari_armes2: List[miniMenu.MenuItem] = []
player_sprite: Sprite = None
mapa_anterior: tiles.TileMapData = None
inventari_obert = False
selected_character = 0
menu: miniMenu.MenuSprite = None
menu_configuracio: miniMenu.MenuSprite = None
mapaJoc = False
pantalla = ""
game_time = 0
game_state = 0
GAME_STATE_PLAYING = 0
GAME_STATE_CHAR_SELECT = 0
max_enemics = 0
dificultad = ""
enemigos_intervalo = 0
velocidad_enemigo = 0
GAME_STATE_JIGSAW_MESSAGE = 0
GAME_STATE_CHAR_STORY = 0
duracion_partida = 0
jigsaw_npc = None
randomIndex2 = 0
duracion_partida = 180
# Estados adicionales
GAME_STATE_INTRO = -1
GAME_STATE_CHAR_STORY = 4
GAME_STATE_NAME_INPUT = 5
GAME_STATE_JIGSAW_MESSAGE = 6
velocidad_enemigo = 55
enemigos_intervalo = 30000
dificultad = "FACIL"
max_enemics = 6
GAME_STATE_CHAR_SELECT = 1
GAME_STATE_NAME_INPUT = 2
GAME_STATE_PLAYING = 3
game_state = GAME_STATE_INTRO
player_name = "HUNTER"
game_time = 180
pantalla = "joc"
mapaJoc = False
# ========== INICIALIZACIÓN ==========
scene.set_background_color(0)
# INTRO SAW
show_saw_intro()
# MENÚ PRINCIPAL
show_main_menu()

def on_update_interval():
    global moneda2
    if game_state == GAME_STATE_PLAYING:
        moneda2 = sprites.create(assets.image("""
            moneda
            """), SpriteKind.moneda)
        tiles.place_on_random_tile(moneda2, sprites.dungeon.dark_ground_center)
game.on_update_interval(5000, on_update_interval)

def on_forever():
    global mapaJoc
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
    spawner_enemics()
    pause(100)
forever(on_forever)
