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
    ENEMIE_PROJECTILE = SpriteKind.create()
    item_suelo = SpriteKind.create()
    escudo_visual = SpriteKind.create()
    sierra = SpriteKind.create()
    palanca = SpriteKind.create()
    cursor = SpriteKind.create()
"""

Listas de coordenadas

"""
def configuracion_partida():
    global menu_configuracio, menu
    menu_configuracio = miniMenu.create_menu(miniMenu.create_menu_item("Tiempo de Partida"),
        miniMenu.create_menu_item("Dificultad"),
        miniMenu.create_menu_item("<- Volver"))
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
    
    
    def on_button_pressed2(selection2, selectedIndex2):
        menu_configuracio.close()
        show_main_menu()
    menu_configuracio.on_button_pressed(controller.B, on_button_pressed2)
    
def mode_attack():
    if not (player_sprite):
        return
    for un_enemigo in sprites.all_of_kind(SpriteKind.enemic):
        un_enemigo.follow(player_sprite, velocidad_enemigo)

def on_on_overlap(sprite_player, sprite_proj):
    sprite_proj.destroy()
    if dodge_roll or escudo_activo:
        return
    info.change_life_by(-1)
    if player_statusbar:
        player_statusbar.value = info.life()
    scene.camera_shake(2, 100)
sprites.on_overlap(SpriteKind.player,
    SpriteKind.ENEMIE_PROJECTILE,
    on_on_overlap)

def show_character_story():
    global game_state, skip_dialogo, bg_sprite3
    game_state = GAME_STATE_CHAR_STORY
    scene.set_background_color(0)
    skip_dialogo = False
    if selected_character == 0:
        bg_sprite3 = sprites.create(assets.image("""
            ander_bg
            """), SpriteKind.food)
        bg_sprite3.set_position(80, 60)
        bg_sprite3.z = -100
        game.show_long_text("ANDER: 'Vi a un hombre morir...'", DialogLayout.BOTTOM)
        if not (controller.B.is_pressed()):
            game.show_long_text("'...y no hice nada.'", DialogLayout.BOTTOM)
    elif selected_character == 1:
        bg_sprite3 = sprites.create(assets.image("""
            kira_bg
            """), SpriteKind.food)
        bg_sprite3.set_position(80, 60)
        bg_sprite3.z = -100
        game.show_long_text("KIRA: 'Manipule vidas sin remordimiento.'",
            DialogLayout.BOTTOM)
        if not (controller.B.is_pressed()):
            game.show_long_text("'Alguien se suicido por mi culpa.'", DialogLayout.BOTTOM)
    else:
        game.show_long_text("RANDOM: 'Siempre fui indiferente.'", DialogLayout.BOTTOM)
        if not (controller.B.is_pressed()):
            game.show_long_text("'No es mi problema - decia.'", DialogLayout.BOTTOM)
    if not (controller.B.is_pressed()):
        game.show_long_text("Y entonces... todo se volvio negro.", DialogLayout.BOTTOM)
    if bg_sprite3:
        bg_sprite3.destroy()
    show_jigsaw_message()

def activar_escudo():
    global escudo_activo, escudo_tiempo_inicio, escudo_sprite
    if arma_equipada != "escudo" or not (player_sprite):
        return
    escudo_activo = True
    escudo_tiempo_inicio = game.runtime()
    escudo_sprite = sprites.create(assets.image("""
            visual_shield
            """),
        SpriteKind.escudo_visual)
    escudo_sprite.set_position(player_sprite.x, player_sprite.y)
    escudo_sprite.z = -1
    animation.run_image_animation(escudo_sprite,
        assets.animation("""
            visual_shield_animation
            """),
        100,
        True)
    effects.star_field.start_screen_effect()

def on_on_overlap2(sprite, otherSprite):
    global is_player_talking, npcs_saved, npcs_dead
    if is_player_talking or not (girl_npc):
        return
    if girl_npc.kind() == SpriteKind.Complete or girl_npc.kind() == SpriteKind.Dead:
        return
    if controller.A.is_pressed():
        is_player_talking = True
        resultado2 = minijuego_esquivar_sierras()
        if resultado2:
            girl_npc.set_kind(SpriteKind.Complete)
            info.change_score_by(200)
            npcs_saved += 1
        else:
            girl_npc.destroy()
            npcs_dead += 1
            info.change_score_by(-100)
        is_player_talking = False
sprites.on_overlap(SpriteKind.player, SpriteKind.NPC_Girl, on_on_overlap2)

def on_on_overlap3(sprite_proj2, enemigo_sprite):
    global enemy_status2
    sprite_proj2.destroy()
    enemy_status2 = statusbars.get_status_bar_attached_to(StatusBarKind.health, enemigo_sprite)
    if enemy_status2:
        dano = sprites.read_data_number(sprite_proj2, "damage")
        if dano == 0:
            dano = 1
        enemy_status2.value -= dano
        if enemy_status2.value <= 0:
            sprites.destroy(enemigo_sprite, effects.disintegrate, 500)
            info.change_score_by(KILL_BONUS)
sprites.on_overlap(SpriteKind.projectile, SpriteKind.enemic, on_on_overlap3)

def spawn_npcs_in_map():
    global doctor_npc, girl_npc, prisoner_npc
    if len(npcs_coordenadas) >= 3:
        doctor_npc = sprites.create(assets.image("""
                npc_doctor
                """),
            SpriteKind.NPC_Doctor)
        tiles.place_on_tile(doctor_npc, npcs_coordenadas[0])
        crear_status_bar(doctor_npc, 1, 2)
        girl_npc = sprites.create(assets.image("""
            npc_girl
            """), SpriteKind.NPC_Girl)
        tiles.place_on_tile(girl_npc, npcs_coordenadas[1])
        crear_status_bar(girl_npc, 1, 2)
        prisoner_npc = sprites.create(assets.image("""
                npc_prisoner
                """),
            SpriteKind.NPC_Prisoner)
        tiles.place_on_tile(prisoner_npc, npcs_coordenadas[2])
        crear_status_bar(prisoner_npc, 1, 2)
    else:
        doctor_npc = sprites.create(assets.image("""
                npc_doctor
                """),
            SpriteKind.NPC_Doctor)
        tiles.place_on_tile(doctor_npc, tiles.get_tile_location(5, 3))
        crear_status_bar(doctor_npc, 1, 2)
        girl_npc = sprites.create(assets.image("""
            npc_girl
            """), SpriteKind.NPC_Girl)
        tiles.place_on_tile(girl_npc, tiles.get_tile_location(10, 5))
        crear_status_bar(girl_npc, 1, 2)
        prisoner_npc = sprites.create(assets.image("""
                npc_prisoner
                """),
            SpriteKind.NPC_Prisoner)
        tiles.place_on_tile(prisoner_npc, tiles.get_tile_location(15, 7))
        crear_status_bar(prisoner_npc, 1, 2)

def on_on_overlap4(sprite2, otherSprite2):
    global is_player_talking, npcs_saved, npcs_dead
    if is_player_talking or not (doctor_npc):
        return
    if doctor_npc.kind() == SpriteKind.Complete or doctor_npc.kind() == SpriteKind.Dead:
        return
    if controller.A.is_pressed():
        is_player_talking = True
        resultado = minijuego_adivinanza_trampa()
        if resultado:
            doctor_npc.set_kind(SpriteKind.Complete)
            info.change_score_by(150)
            npcs_saved += 1
        else:
            doctor_npc.destroy()
            npcs_dead += 1
            info.change_score_by(-50)
        is_player_talking = False
sprites.on_overlap(SpriteKind.player, SpriteKind.NPC_Doctor, on_on_overlap4)


def on_down_pressed():
    global ultima_direccion_x, ultima_direccion_y
    ultima_direccion_x = 0
    ultima_direccion_y = 1
    if game_state == GAME_STATE_PLAYING and player_sprite:
        if selected_character == 0:
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    character_ander_walking_down
                    """),
                200,
                True)
        elif selected_character == 1:
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    character_kira_walking_down
                    """),
                200,
                True)
        else:
            animar_random_walking("down")
controller.down.on_event(ControllerButtonEvent.PRESSED, on_down_pressed)

def menu_temps2():
    global menu_temps, menu
    menu_temps = miniMenu.create_menu(miniMenu.create_menu_item("3 minutos"),
        miniMenu.create_menu_item("5 minutos"),
        miniMenu.create_menu_item("7 minutos"),
        miniMenu.create_menu_item("<- Volver"))
    menu = menu_temps
    estructura_menus()
    
    def on_button_pressed3(selection3, selectedIndex3):
        global duracion_partida
        menu_temps.close()
        if selectedIndex3 == 0:
            duracion_partida = 180
            game.splash("3 minutos", "")
        elif selectedIndex3 == 1:
            duracion_partida = 300
            game.splash("5 minutos", "")
        elif selectedIndex3 == 2:
            duracion_partida = 420
            game.splash("7 minutos", "")
        configuracion_partida()
    menu_temps.on_button_pressed(controller.A, on_button_pressed3)
    
    
    def on_button_pressed4(selection4, selectedIndex4):
        menu_temps.close()
        configuracion_partida()
    menu_temps.on_button_pressed(controller.B, on_button_pressed4)
    
def soltar_arma_actual():
    global item_suelo2, arma_equipada
    if arma_equipada == "":
        return
    if arma_equipada == "espada":
        item_suelo2 = sprites.create(assets.image("""
                sword_swing_right
                """),
            SpriteKind.item_suelo)
        sprites.set_data_string(item_suelo2, "tipo", "espada")
    elif arma_equipada == "pistola":
        item_suelo2 = sprites.create(assets.image("""
                gun_right
                """),
            SpriteKind.item_suelo)
        sprites.set_data_string(item_suelo2, "tipo", "pistola")
    elif arma_equipada == "escudo":
        item_suelo2 = sprites.create(assets.image("""
            shield
            """), SpriteKind.item_suelo)
        sprites.set_data_string(item_suelo2, "tipo", "escudo")
    if item_suelo2 and player_sprite:
        item_suelo2.set_position(player_sprite.x, player_sprite.y)
    arma_equipada = ""
def comprar_arma(nombre_arma: str, precio: number, imagen_arma: Image):
    global score, arma_equipada, arma_hud
    if arma_equipada != "":
        soltar_arma_actual()
    info.change_score_by(0 - precio)
    score += 0 - precio
    arma_equipada = nombre_arma
    if arma_hud:
        arma_hud.destroy()
    arma_hud = sprites.create(imagen_arma, SpriteKind.food)
    arma_hud.set_flag(SpriteFlag.RELATIVE_TO_CAMERA, True)
    arma_hud.set_position(20, 105)
    game.splash("" + nombre_arma + " EQUIPADA", "")
def spawner_enemics():
    global ultimo_enemigo2, enemic1, enemy_spawn_index
    if game_state != GAME_STATE_PLAYING or not (player_sprite):
        return
    if len(sprites.all_of_kind(SpriteKind.enemic)) >= max_enemics:
        return
    if game.runtime() - ultimo_enemigo2 < enemigos_intervalo:
        return
    ultimo_enemigo2 = game.runtime()
    enemic1 = sprites.create(assets.image("""
        enemy_bat
        """), SpriteKind.enemic)
    if len(enemy_coordenadas) > 0:
        tiles.place_on_tile(enemic1,
            enemy_coordenadas[enemy_spawn_index % len(enemy_coordenadas)])
        enemy_spawn_index += 1
    else:
        enemic1.set_position(randint(20, 140), randint(20, 100))
    enemic1.follow(player_sprite, velocidad_enemigo)
    if ultima_direccion_x > 0:
        animation.run_image_animation(enemic1,
            assets.animation("""
                enemy_bat_move_right
                """),
            200,
            True)
    else:
        animation.run_image_animation(enemic1,
            assets.animation("""
                enemy_bat_move_left
                """),
            200,
            True)
    crear_status_bar(enemic1, 3, 7)

def show_saw_intro():
    global skip_dialogo, bg_sprite
    skip_dialogo = False
    sprites.destroy_all_sprites_of_kind(SpriteKind.food)
    bg_sprite = sprites.create(assets.image("""
        jigsaw_bg
        """), SpriteKind.food)
    bg_sprite.set_position(80, 60)
    bg_sprite.z = -100
    bg_sprite.set_flag(SpriteFlag.GHOST, True)
    scene.set_background_color(1)
    game.splash("B: Saltar dialogos", "A: Continuar")
    if not (skip_dialogo):
        game.show_long_text("Hola... Quiero jugar un juego.", DialogLayout.BOTTOM)
        if controller.B.is_pressed():
            skip_dialogo = True
    if not (skip_dialogo):
        game.show_long_text("Has ignorado el sufrimiento ajeno.", DialogLayout.BOTTOM)
        if controller.B.is_pressed():
            skip_dialogo = True
    if not (skip_dialogo):
        game.show_long_text("Ahora deberas demostrar que valoras la vida.",
            DialogLayout.BOTTOM)
        if controller.B.is_pressed():
            skip_dialogo = True
    if not (skip_dialogo):
        game.show_long_text("Tienes 180 segundos.", DialogLayout.BOTTOM)
        if controller.B.is_pressed():
            skip_dialogo = True
    if not (skip_dialogo):
        game.show_long_text("Vive o muere. Haz tu eleccion.", DialogLayout.BOTTOM)
    if bg_sprite:
        bg_sprite.destroy()
    show_character_select()

def on_right_pressed():
    global ultima_direccion_x, ultima_direccion_y
    ultima_direccion_x = 1
    ultima_direccion_y = 0
    if game_state == GAME_STATE_PLAYING and player_sprite:
        if selected_character == 0:
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    character_ander_walking_right
                    """),
                200,
                True)
        elif selected_character == 1:
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    character_kira_walking_right
                    """),
                200,
                True)
        else:
            animar_random_walking("right")
controller.right.on_event(ControllerButtonEvent.PRESSED, on_right_pressed)

def on_left_pressed():
    global ultima_direccion_x, ultima_direccion_y
    ultima_direccion_x = -1
    ultima_direccion_y = 0
    if game_state == GAME_STATE_PLAYING and player_sprite:
        if selected_character == 0:
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    character_ander_walking_left
                    """),
                200,
                True)
        elif selected_character == 1:
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    character_kira_walking_left
                    """),
                200,
                True)
        else:
            animar_random_walking("left")
controller.left.on_event(ControllerButtonEvent.PRESSED, on_left_pressed)

def crear_status_bar(sprite3: Sprite, max_vida: number, color2: number):
    global status_bar
    status_bar = statusbars.create(20, 3, StatusBarKind.health)
    status_bar.attach_to_sprite(sprite3)
    status_bar.max = max_vida
    status_bar.value = max_vida
    status_bar.set_color(color2, 15)
    status_bar.set_bar_border(1, 0)
    return status_bar

def mostrar_pregunta_tutorial():
    global menu_tutorial
    menu_tutorial = miniMenu.create_menu(miniMenu.create_menu_item("Ver Tutorial"),
        miniMenu.create_menu_item("Saltar y Jugar"),
        miniMenu.create_menu_item("<- Volver a Personajes"))
    menu_tutorial.set_position(80, 60)
    
    def on_button_pressed5(selection5, selectedIndex5):
        global mapaJoc
        menu_tutorial.close()
        if selectedIndex5 == 0:
            mostrar_tutorial()
            mapaJoc = True
        elif selectedIndex5 == 1:
            mapaJoc = True
        else:
            show_character_select()
    menu_tutorial.on_button_pressed(controller.A, on_button_pressed5)
    
    
    def on_button_pressed6(selection6, selectedIndex6):
        menu_tutorial.close()
        show_character_select()
    menu_tutorial.on_button_pressed(controller.B, on_button_pressed6)
    

def on_a_pressed():
    global ultimo_dodge, dodge_roll
    if game_state != GAME_STATE_PLAYING:
        return
    if game.runtime() - ultimo_dodge < cooldown_minimo_dodge:
        return
    ultimo_dodge = game.runtime()
    dodge_roll = True
    scene.camera_shake(2, 200)
    pause(500)
    dodge_roll = False
controller.A.on_event(ControllerButtonEvent.PRESSED, on_a_pressed)


def on_countdown_end():
    global bg_sprite
    scene.set_background_color(0)
    bg_sprite = sprites.create(assets.image("""
        jigsaw_bg
        """), SpriteKind.food)
    bg_sprite.set_position(80, 60)
    bg_sprite.z = -100
    game.show_long_text("El tiempo se agoto.", DialogLayout.BOTTOM)
    if score >= 500 and npcs_dead == 0:
        game.show_long_text("JIGSAW: 'Impresionante! Eres libre.'", DialogLayout.BOTTOM)
        game.splash("FINAL PERFECTO", "" + str(score) + " pts")
    elif score >= 300:
        game.show_long_text("JIGSAW: 'Sobreviviste... pero a que costo.'",
            DialogLayout.BOTTOM)
        game.splash("FINAL BUENO", "" + str(score) + " pts")
    else:
        game.show_long_text("JIGSAW: 'Fallaste.'", DialogLayout.BOTTOM)
        scene.camera_shake(8, 2000)
        game.splash("GAME OVER", "" + str(score) + " pts")
    if bg_sprite:
        bg_sprite.destroy()
    pause(2000)
    game.reset()
info.on_countdown_end(on_countdown_end)

def minijuego_esquivar_sierras():
    global jugador_temp, golpeado, shurikens_esquivados, contador
    game.show_long_text("NINA: 'El antidoto esta al otro lado...'",
        DialogLayout.BOTTOM)
    game.splash("ESQUIVA!", "Muevete con <- ->")
    jugador_temp = sprites.create(assets.image("""
            character_ander
            """),
        SpriteKind.player)
    jugador_temp.set_position(80, 100)
    jugador_temp.set_stay_in_screen(True)
    controller.move_sprite(jugador_temp, 120, 0)
    golpeado = False
    shurikens_esquivados = 0
    contador = textsprite.create("0/8", 0, 1)
    contador.set_flag(SpriteFlag.RELATIVE_TO_CAMERA, True)
    contador.set_position(80, 10)
    for index in range(8):
        shuriken = sprites.create(assets.image("""
            shuriken
            """), SpriteKind.sierra)
        shuriken.set_position(randint(20, 140), 0)
        shuriken.set_velocity(0, 80)
        animation.run_image_animation(shuriken,
            assets.animation("""
                shuriken_animation_rotation
                """),
            100,
            True)
        pause(800)
        if shuriken.overlaps_with(jugador_temp):
            golpeado = True
            scene.camera_shake(4, 500)
            shuriken.destroy()
            break
        if shuriken.y > 120:
            shurikens_esquivados += 1
            contador.set_text("" + str(shurikens_esquivados) + "/8")
        shuriken.destroy()
    jugador_temp.destroy()
    contador.destroy()
    sprites.destroy_all_sprites_of_kind(SpriteKind.sierra)
    if not (golpeado) and shurikens_esquivados >= 6:
        game.show_long_text("Salvaste a Emma!", DialogLayout.BOTTOM)
        return True
    else:
        game.show_long_text("Emma murio...", DialogLayout.BOTTOM)
        return False

def on_on_overlap5(sprite_jugador, item):
    global tipo_arma, arma_equipada, imagen_arma2, arma_hud
    if not (controller.A.is_pressed()):
        return
    tipo_arma = sprites.read_data_string(item, "tipo")
    if arma_equipada != "":
        soltar_arma_actual()
    arma_equipada = tipo_arma
    if arma_hud:
        arma_hud.destroy()
    if tipo_arma == "espada":
        imagen_arma2 = assets.image("""
            sword_swing_right
            """)
    elif tipo_arma == "pistola":
        imagen_arma2 = assets.image("""
            gun_right
            """)
    elif tipo_arma == "escudo":
        imagen_arma2 = assets.image("""
            shield
            """)
    if imagen_arma2:
        arma_hud = sprites.create(imagen_arma2, SpriteKind.food)
        arma_hud.set_flag(SpriteFlag.RELATIVE_TO_CAMERA, True)
        arma_hud.set_position(20, 105)
    item.destroy()
sprites.on_overlap(SpriteKind.player, SpriteKind.item_suelo, on_on_overlap5)

def on_on_overlap6(sprite4, otherSprite3):
    global is_player_talking, npcs_saved, npcs_dead
    if is_player_talking or not (prisoner_npc):
        return
    if prisoner_npc.kind() == SpriteKind.Complete or prisoner_npc.kind() == SpriteKind.Dead:
        return
    if controller.A.is_pressed():
        is_player_talking = True
        resultado3 = minijuego_desactiva_trampas()
        if resultado3:
            prisoner_npc.set_kind(SpriteKind.Complete)
            info.change_score_by(150)
            npcs_saved += 1
        else:
            prisoner_npc.destroy()
            npcs_dead += 1
            info.change_score_by(-50)
        is_player_talking = False
sprites.on_overlap(SpriteKind.player, SpriteKind.NPC_Prisoner, on_on_overlap6)

# ========== GAMEPLAY ==========
def start_gameplay():
    global ultimo_enemigo, game_state, score, arma_equipada, arma_hud, player_sprite, player_statusbar
    ultimo_enemigo = game.runtime()
    info.start_countdown(duracion_partida)
    game_state = GAME_STATE_PLAYING
    score = 0
    sprites.destroy_all_sprites_of_kind(SpriteKind.player)
    sprites.destroy_all_sprites_of_kind(SpriteKind.food)
    info.set_life(5)
    arma_equipada = "pistola"

    arma_hud = sprites.create(assets.image("""gun_right"""),
        SpriteKind.food)
    arma_hud.set_flag(SpriteFlag.RELATIVE_TO_CAMERA, True)
    arma_hud.set_position(20, 105)
    arma_hud.z = 100

    if selected_character == 0:
        player_sprite = sprites.create(assets.image("""
                character_ander
                """),
            SpriteKind.player)
    elif selected_character == 1:
        player_sprite = sprites.create(assets.image("""
                character_kira
                """),
            SpriteKind.player)
    else:
        player_sprite = crear_jugador_random()
    player_sprite.set_stay_in_screen(True)
    player_statusbar = crear_status_bar(player_sprite, 5, 2)
    spawn_npcs_in_map()
def animar_random_walking(direccion: str):
    if not (player_sprite):
        return
    if randomIndex == 1:
        if direccion == "down":
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    random1_walking_down
                    """),
                200,
                True)
        elif direccion == "up":
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    random1_walking_up
                    """),
                200,
                True)
        elif direccion == "left":
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    random1_walking_left
                    """),
                200,
                True)
        elif direccion == "right":
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    random1_walking_right
                    """),
                200,
                True)
    elif randomIndex == 2:
        if direccion == "down":
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    random2_walking_down
                    """),
                200,
                True)
        elif direccion == "up":
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    random2_walking_up
                    """),
                200,
                True)
        elif direccion == "left":
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    random2_walking_left
                    """),
                200,
                True)
        elif direccion == "right":
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    random2_walking_right
                    """),
                200,
                True)
    elif randomIndex == 3:
        if direccion == "down":
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    random3_walking_down
                    """),
                200,
                True)
        elif direccion == "up":
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    random3_walking_up
                    """),
                200,
                True)
        elif direccion == "left":
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    random3_walking_left
                    """),
                200,
                True)
        elif direccion == "right":
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    random3_walking_right
                    """),
                200,
                True)
    elif randomIndex == 4:
        if direccion == "down":
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    random4_walking_down
                    """),
                200,
                True)
        elif direccion == "up":
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    random4_walking_up
                    """),
                200,
                True)
        elif direccion == "left":
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    random4_walking_left
                    """),
                200,
                True)
        elif direccion == "right":
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    random4_walking_right
                    """),
                200,
                True)
    elif direccion == "down":
        animation.run_image_animation(player_sprite,
            assets.animation("""
                random5_walking_down
                """),
            200,
            True)
    elif direccion == "up":
        animation.run_image_animation(player_sprite,
            assets.animation("""
                random5_walking_up
                """),
            200,
            True)
    elif direccion == "left":
        animation.run_image_animation(player_sprite,
            assets.animation("""
                random5_walking_left
                """),
            200,
            True)
    elif direccion == "right":
        animation.run_image_animation(player_sprite,
            assets.animation("""
                random5_walking_right
                """),
            200,
            True)

def minijuego_adivinanza_trampa():
    global menu_adivinanza, respuesta_correcta, tiempo_inicio
    game.show_long_text("DOCTOR: 'Tengo una BOMBA! Ayudame!'", DialogLayout.BOTTOM)
    game.show_long_text("Ves 3 cables...", DialogLayout.BOTTOM)
    menu_adivinanza = miniMenu.create_menu(miniMenu.create_menu_item("Cable ROJO"),
        miniMenu.create_menu_item("Cable AZUL"),
        miniMenu.create_menu_item("Cable VERDE"),
        miniMenu.create_menu_item("NO CORTAR NINGUNO"))
    menu_adivinanza.set_position(80, 60)
    respuesta_correcta = -1
    
    def on_button_pressed7(selection7, selectedIndex7):
        global respuesta_correcta
        respuesta_correcta = selectedIndex7
        menu_adivinanza.close()
    menu_adivinanza.on_button_pressed(controller.A, on_button_pressed7)
    
    tiempo_inicio = game.runtime()
    while respuesta_correcta == -1 and game.runtime() - tiempo_inicio < 15000:
        pause(100)
    if respuesta_correcta == 3:
        game.show_long_text("Correcto! Me salvaste!", DialogLayout.BOTTOM)
        return True
    else:
        game.show_long_text("*EXPLOSION*", DialogLayout.BOTTOM)
        scene.camera_shake(8, 1000)
        return False
def crear_jugador_random():
    global randomIndex
    randomIndex = randint(1, 5)
    if randomIndex == 1:
        return sprites.create(assets.image("""
            random1
            """), SpriteKind.player)
    elif randomIndex == 2:
        return sprites.create(assets.image("""
            random2
            """), SpriteKind.player)
    elif randomIndex == 3:
        return sprites.create(assets.image("""
            random3
            """), SpriteKind.player)
    elif randomIndex == 4:
        return sprites.create(assets.image("""
            random4
            """), SpriteKind.player)
    else:
        return sprites.create(assets.image("""
            random5
            """), SpriteKind.player)
def menu_dificultad2():
    global menu_dificultad, menu
    menu_dificultad = miniMenu.create_menu(miniMenu.create_menu_item("Facil"),
        miniMenu.create_menu_item("Dificil"),
        miniMenu.create_menu_item("<- Volver"))
    menu = menu_dificultad
    estructura_menus()
    
    def on_button_pressed8(selection8, selectedIndex8):
        global dificultad, enemigos_intervalo, velocidad_enemigo, max_enemics
        menu_dificultad.close()
        if selectedIndex8 == 0:
            dificultad = "FACIL"
            enemigos_intervalo = 30000
            velocidad_enemigo = 45
            max_enemics = 4
        elif selectedIndex8 == 1:
            dificultad = "DIFICIL"
            enemigos_intervalo = 15000
            velocidad_enemigo = 85
            max_enemics = 10
        configuracion_partida()
    menu_dificultad.on_button_pressed(controller.A, on_button_pressed8)
    
    
    def on_button_pressed9(selection9, selectedIndex9):
        menu_dificultad.close()
        configuracion_partida()
    menu_dificultad.on_button_pressed(controller.B, on_button_pressed9)
    

def on_up_pressed():
    global ultima_direccion_x, ultima_direccion_y
    ultima_direccion_x = 0
    ultima_direccion_y = -1
    if game_state == GAME_STATE_PLAYING and player_sprite:
        if selected_character == 0:
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    character_ander_walking_up
                    """),
                200,
                True)
        elif selected_character == 1:
            animation.run_image_animation(player_sprite,
                assets.animation("""
                    character_kira_walking_up
                    """),
                200,
                True)
        else:
            animar_random_walking("up")
controller.up.on_event(ControllerButtonEvent.PRESSED, on_up_pressed)


def cargar_coordenadas_mapa():
    global npcs_coordenadas, cofres_coordenadas, enemy_coordenadas, floor1_coordenadas, floor2_coordenadas
    npcs_coordenadas = tiles.get_tiles_by_type(sprites.dungeon.collectible_insignia)
    cofres_coordenadas = tiles.get_tiles_by_type(sprites.dungeon.chest_closed)
    enemy_coordenadas = tiles.get_tiles_by_type(sprites.dungeon.collectible_blue_crystal)
    floor1_coordenadas = tiles.get_tiles_by_type(sprites.dungeon.floor_mixed)
    floor2_coordenadas = tiles.get_tiles_by_type(sprites.dungeon.floor_dark5)

def show_main_menu():
    global game_state, skip_dialogo, bg_sprite, main_menu, menu
    game_state = GAME_STATE_MENU
    skip_dialogo = False
    sprites.destroy_all_sprites_of_kind(SpriteKind.food)
    bg_sprite = sprites.create(assets.image("""
        scary_bg
        """), SpriteKind.food)
    bg_sprite.set_position(80, 60)
    bg_sprite.z = -100
    bg_sprite.set_flag(SpriteFlag.GHOST, True)
    game.splash("PLAY OR DIE - JIGSAW", "")
    main_menu = miniMenu.create_menu(miniMenu.create_menu_item("HISTORIA"),
        miniMenu.create_menu_item("CONFIGURACION"),
        miniMenu.create_menu_item("YOU VS ALL"),
        miniMenu.create_menu_item("CREDITOS"))
    menu = main_menu
    estructura_menus()
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
    
    def on_button_pressed10(selection10, selectedIndex10):
        main_menu.close()
        if bg_sprite:
            bg_sprite.destroy()
        if selectedIndex10 == 0:
            show_saw_intro()
        elif selectedIndex10 == 1:
            configuracion_partida()
        elif selectedIndex10 == 2:
            game.splash("VERSUS", "Proximamente!")
            show_main_menu()
        elif selectedIndex10 == 3:
            game.show_long_text("PLAY OR DIE - JIGSAW", DialogLayout.BOTTOM)
            game.show_long_text("Creado por: Evelyn y Mariona", DialogLayout.BOTTOM)
            game.show_long_text("DAM 2026 - La Salle Gracia", DialogLayout.BOTTOM)
            show_main_menu()
    main_menu.on_button_pressed(controller.A, on_button_pressed10)
    
def on_update_interval():
    global moneda22
    if game_state != GAME_STATE_PLAYING:
        return
    moneda22 = sprites.create(assets.image("""
        item_coin
        """), SpriteKind.moneda)
    moneda22.z = 10
    animation.run_image_animation(moneda22,
        assets.animation("""
            item_coin_rotating
            """),
        200,
        True)
    if len(floor1_coordenadas) > 0:
        tiles.place_on_tile(moneda22,
            floor1_coordenadas[randint(0, len(floor1_coordenadas) - 1)])
    elif len(floor2_coordenadas) > 0:
        tiles.place_on_tile(moneda22,
            floor2_coordenadas[randint(0, len(floor2_coordenadas) - 1)])
    else:
        moneda22.set_position(randint(20, 140), randint(20, 100))

def on_on_overlap7(player22, coin):
    global score
    score += MONEDA_VALOR
    info.change_score_by(MONEDA_VALOR)
    music.play(music.melody_playable(music.ba_ding),
        music.PlaybackMode.IN_BACKGROUND)
    sprites.destroy(coin, effects.spray, 200)
sprites.on_overlap(SpriteKind.player, SpriteKind.moneda, on_on_overlap7)

def mostrar_tutorial():
    global tutorial_mostrado
    if tutorial_mostrado:
        return
    tutorial_mostrado = True
    game.show_long_text("CONTROLES", DialogLayout.BOTTOM)
    if controller.B.is_pressed():
        return
    game.show_long_text("FLECHAS: Moverte", DialogLayout.BOTTOM)
    if controller.B.is_pressed():
        return
    game.show_long_text("A: Dodge + Interactuar NPCs", DialogLayout.BOTTOM)
    if controller.B.is_pressed():
        return
    game.show_long_text("B: Atacar (con arma)", DialogLayout.BOTTOM)
    if controller.B.is_pressed():
        return
    game.show_long_text("OBJETIVO: Salva 3 NPCs, sobrevive!", DialogLayout.BOTTOM)

def show_character_select():
    global game_state, bg_sprite2, char_menu
    game_state = GAME_STATE_CHAR_SELECT
    sprites.destroy_all_sprites_of_kind(SpriteKind.player)
    sprites.destroy_all_sprites_of_kind(SpriteKind.food)
    bg_sprite2 = sprites.create(assets.image("""
        scary_bg
        """), SpriteKind.food)
    bg_sprite2.set_position(80, 60)
    bg_sprite2.z = -100
    bg_sprite2.set_flag(SpriteFlag.GHOST, True)
    game.splash("Elige personaje", "B: Volver al menu")
    char_menu = miniMenu.create_menu(miniMenu.create_menu_item("ANDER", assets.image("""
            character_ander
            """)),
        miniMenu.create_menu_item("KIRA", assets.image("""
            character_kira
            """)),
        miniMenu.create_menu_item("RANDOM", assets.image("""
            random1
            """)),
        miniMenu.create_menu_item("<- Volver al Menu"))
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
    
    def on_button_pressed11(selection11, selectedIndex11):
        global selected_character
        char_menu.close()
        if bg_sprite2:
            bg_sprite2.destroy()
        if selectedIndex11 == 3:
            show_main_menu()
        else:
            selected_character = selectedIndex11
            show_character_story()
    char_menu.on_button_pressed(controller.A, on_button_pressed11)
    
    
    def on_button_pressed12(selection12, selectedIndex12):
        char_menu.close()
        if bg_sprite2:
            bg_sprite2.destroy()
        show_main_menu()
    char_menu.on_button_pressed(controller.B, on_button_pressed12)
    
def desactivar_escudo():
    global escudo_activo, escudo_sprite, arma_equipada, arma_hud
    escudo_activo = False
    if escudo_sprite:
        escudo_sprite.destroy()
        escudo_sprite = None
    arma_equipada = ""
    if arma_hud:
        arma_hud.destroy()
        arma_hud = sprites.create(assets.image("""
                hud_empty_weapon
                """),
            SpriteKind.food)
        arma_hud.set_flag(SpriteFlag.RELATIVE_TO_CAMERA, True)
        arma_hud.set_position(20, 105)

def show_jigsaw_message():
    global game_state, skip_dialogo, bg_sprite, character_names, char_name2
    game_state = GAME_STATE_JIGSAW_MESSAGE
    scene.set_background_color(0)
    skip_dialogo = False
    bg_sprite = sprites.create(assets.image("""
        jigsaw_bg
        """), SpriteKind.food)
    bg_sprite.set_position(80, 60)
    bg_sprite.z = -100
    bg_sprite.set_flag(SpriteFlag.GHOST, True)
    character_names = ["Ander", "Kira", "Random"]
    char_name2 = character_names[selected_character]
    game.show_long_text("JIGSAW: 'Hola, " + char_name2 + ".'", DialogLayout.BOTTOM)
    if not (controller.B.is_pressed()):
        game.show_long_text("'Tienes 180 segundos para redimirte.'", DialogLayout.BOTTOM)
    if not (controller.B.is_pressed()):
        game.show_long_text("'Salva a los inocentes... y sobrevive.'",
            DialogLayout.BOTTOM)
    if not (controller.B.is_pressed()):
        game.show_long_text("Vive o muere. Haz tu eleccion.", DialogLayout.BOTTOM)
    if bg_sprite:
        bg_sprite.destroy()
        bg_sprite = None
    mostrar_pregunta_tutorial()

def on_on_overlap8(player2, enemy):
    global distancia_repulsion, nueva_x, nueva_y, nueva_loc
    if dodge_roll or escudo_activo:
        return
    info.change_life_by(-1)
    if player_statusbar:
        player_statusbar.value = info.life()
    scene.camera_shake(4, 500)
    distancia_repulsion = 15
    nueva_x = player2.x
    nueva_y = player2.y
    if player2.x > enemy.x:
        nueva_x = player2.x + distancia_repulsion
    else:
        nueva_x = player2.x - distancia_repulsion
    if player2.y > enemy.y:
        nueva_y = player2.y + distancia_repulsion / 2
    else:
        nueva_y = player2.y - distancia_repulsion / 2
    nueva_loc = tiles.get_tile_location(int(nueva_x / 16), int(nueva_y / 16))
    if nueva_x > 8 and nueva_x < 152 and nueva_y > 8 and nueva_y < 112:
        if not (tiles.tile_at_location_is_wall(nueva_loc)):
            player2.x = nueva_x
            player2.y = nueva_y
        elif player2.x > enemy.x:
            player2.x = min(player2.x + 5, 150)
        else:
            player2.x = max(player2.x - 5, 10)
sprites.on_overlap(SpriteKind.player, SpriteKind.enemic, on_on_overlap8)

def estructura_menus():
    menu.set_position(80, 60)
    menu.setMenuStyleProperty(miniMenu.MenuStyleProperty.WIDTH, 120)
    menu.setMenuStyleProperty(miniMenu.MenuStyleProperty.HEIGHT, 60)
    menu.setStyleProperty(miniMenu.StyleKind.DEFAULT,
        miniMenu.StyleProperty.BACKGROUND,
        15)
    menu.setStyleProperty(miniMenu.StyleKind.DEFAULT,
        miniMenu.StyleProperty.FOREGROUND,
        1)
    menu.setStyleProperty(miniMenu.StyleKind.SELECTED,
        miniMenu.StyleProperty.BACKGROUND,
        8)
    menu.setStyleProperty(miniMenu.StyleKind.SELECTED,
        miniMenu.StyleProperty.FOREGROUND,
        1)
def update_escudo():
    if not (escudo_activo):
        return
    if escudo_sprite and player_sprite:
        escudo_sprite.set_position(player_sprite.x, player_sprite.y)
    if game.runtime() - escudo_tiempo_inicio >= DURACION_ESCUDO:
        desactivar_escudo()

def on_overlap_tile(sprite_jugador2, cofre):
    global menu_armas
    if not (controller.A.is_pressed()):
        return
    tiles.set_tile_at(cofre, sprites.dungeon.chest_open)
    game.show_long_text("Cofre! Tu dinero: $" + ("" + str(score)),
        DialogLayout.BOTTOM)
    menu_armas = miniMenu.create_menu(miniMenu.create_menu_item("Espada ($50)",
            assets.image("""
                sword_swing_right
                """)),
        miniMenu.create_menu_item("Pistola ($75)", assets.image("""
            gun_right
            """)),
        miniMenu.create_menu_item("Escudo ($100)", assets.image("""
            shield
            """)),
        miniMenu.create_menu_item("Cancelar"))
    menu_armas.set_position(80, 60)
    
    def on_button_pressed13(selection13, selectedIndex13):
        menu_armas.close()
        if selectedIndex13 == 0 and score >= PRECIO_ESPADA:
            comprar_arma("espada",
                PRECIO_ESPADA,
                assets.image("""
                    sword_swing_right
                    """))
        elif selectedIndex13 == 1 and score >= PRECIO_PISTOLA:
            comprar_arma("pistola",
                PRECIO_PISTOLA,
                assets.image("""
                    gun_right
                    """))
        elif selectedIndex13 == 2 and score >= PRECIO_ESCUDO:
            comprar_arma("escudo",
                PRECIO_ESCUDO,
                assets.image("""
                    shield
                    """))
        elif selectedIndex13 < 3:
            game.splash("DINERO INSUFICIENTE", "")
    menu_armas.on_button_pressed(controller.A, on_button_pressed13)
    
    
    def on_button_pressed14(selection14, selectedIndex14):
        menu_armas.close()
    menu_armas.on_button_pressed(controller.B, on_button_pressed14)
    
scene.on_overlap_tile(SpriteKind.player,
    sprites.dungeon.chest_closed,
    on_overlap_tile)

def minijuego_desactiva_trampas():
    global estados_palancas, cursor_pos, intentos, resultado_final, minijuego_terminado, cursor2, intentos_text
    numeros_sprites: List[TextSprite] = []
    palancas: List[Sprite] = []
    game.show_long_text("PRISIONERO: 'Las cadenas me aplastan!'",
        DialogLayout.BOTTOM)
    game.show_long_text("PISTA: Palancas PARES liberan", DialogLayout.BOTTOM)
    estados_palancas = [False, False, False, False, False]
    cursor_pos = 0
    intentos = 0
    resultado_final = False
    minijuego_terminado = False
    for j in range(5):
        palanca2 = sprites.create(assets.image("""
            lever_off
            """), SpriteKind.palanca)
        palanca2.set_position(20 + j * 30, 60)
        palancas.append(palanca2)
        num = textsprite.create("" + str((j + 1)), 0, 1)
        num.set_position(20 + j * 30, 45)
        numeros_sprites.append(num)
    cursor2 = sprites.create(assets.image("""
            cursor_arrow
            """),
        SpriteKind.cursor)
    cursor2.set_position(palancas[0].x, 40)
    intentos_text = textsprite.create("Intentos: 3/3", 0, 1)
    intentos_text.set_position(80, 10)
    while intentos < 3 and not (minijuego_terminado):
        if controller.right.is_pressed() and cursor_pos < 4:
            cursor_pos += 1
            cursor2.set_position(palancas[cursor_pos].x, 40)
            pause(200)
        elif controller.left.is_pressed() and cursor_pos > 0:
            cursor_pos += 0 - 1
            cursor2.set_position(palancas[cursor_pos].x, 40)
            pause(200)
        if controller.A.is_pressed():
            estados_palancas[cursor_pos] = not (estados_palancas[cursor_pos])
            if estados_palancas[cursor_pos]:
                palancas[cursor_pos].set_image(assets.image("""
                    lever_on
                    """))
            else:
                palancas[cursor_pos].set_image(assets.image("""
                    lever_off
                    """))
            pause(300)
        if controller.B.is_pressed():
            intentos += 1
            intentos_text.set_text("Intentos: " + ("" + str((3 - intentos))) + "/3")
            if estados_palancas[1] and estados_palancas[3] and not (estados_palancas[0]) and not (estados_palancas[2]) and not (estados_palancas[4]):
                game.show_long_text("CORRECTO! Marcus libre!", DialogLayout.BOTTOM)
                resultado_final = True
                minijuego_terminado = True
            else:
                game.show_long_text("Incorrecto!", DialogLayout.BOTTOM)
                if intentos >= 3:
                    game.show_long_text("Marcus murio...", DialogLayout.BOTTOM)
                    minijuego_terminado = True
                else:
                    for k in range(5):
                        estados_palancas[k] = False
                        palancas[k].set_image(assets.image("""
                            lever_off
                            """))
            pause(500)
        pause(50)
    cursor2.destroy()
    intentos_text.destroy()
    for p in palancas:
        p.destroy()
    for ns in numeros_sprites:
        ns.destroy()
    return resultado_final
projectile: Sprite = None
tiempo_ultimo_disparo = 0
ultimo_ataque = 0
intentos_text: TextSprite = None
cursor2: Sprite = None
minijuego_terminado = False
resultado_final = False
intentos = 0
cursor_pos = 0
estados_palancas: List[bool] = []
menu_armas: miniMenu.MenuSprite = None
nueva_loc: tiles.Location = None
nueva_y = 0
nueva_x = 0
distancia_repulsion = 0
char_name2 = ""
character_names: List[str] = []
char_menu: miniMenu.MenuSprite = None
bg_sprite2: Sprite = None
tutorial_mostrado = False
moneda22: Sprite = None
main_menu: miniMenu.MenuSprite = None
floor2_coordenadas: List[tiles.Location] = []
floor1_coordenadas: List[tiles.Location] = []
cofres_coordenadas: List[tiles.Location] = []
menu_dificultad: miniMenu.MenuSprite = None
tiempo_inicio = 0
respuesta_correcta = 0
menu_adivinanza: miniMenu.MenuSprite = None
randomIndex = 0
ultimo_enemigo = 0
imagen_arma2: Image = None
tipo_arma = ""
contador: TextSprite = None
shurikens_esquivados = 0
golpeado = False
jugador_temp: Sprite = None
ultimo_dodge = 0
menu_tutorial: miniMenu.MenuSprite = None
status_bar: StatusBarSprite = None
enemy_spawn_index = 0
enemy_coordenadas: List[tiles.Location] = []
enemic1: Sprite = None
ultimo_enemigo2 = 0
arma_hud: Sprite = None
score = 0
item_suelo2: Sprite = None
menu_temps: miniMenu.MenuSprite = None
ultima_direccion_y = 0
prisoner_npc: Sprite = None
doctor_npc: Sprite = None
npcs_coordenadas: List[tiles.Location] = []
enemy_status2: StatusBarSprite = None
npcs_dead = 0
npcs_saved = 0
girl_npc: Sprite = None
is_player_talking = False
escudo_tiempo_inicio = 0
arma_equipada = ""
bg_sprite3: Sprite = None
selected_character = 0
skip_dialogo = False
player_statusbar: StatusBarSprite = None
escudo_activo = False
dodge_roll = False
player_sprite: Sprite = None
menu: miniMenu.MenuSprite = None
menu_configuracio: miniMenu.MenuSprite = None
cooldown_minimo_dodge = 0
mapaJoc = False
GAME_STATE_MENU = 0
game_state = 0
GAME_STATE_PLAYING = 0
GAME_STATE_CHAR_SELECT = 0
max_enemics = 0
dificultad = ""
enemigos_intervalo = 0
velocidad_enemigo = 0
GAME_STATE_JIGSAW_MESSAGE = 0
GAME_STATE_CHAR_STORY = 0
KILL_BONUS = 0
MONEDA_VALOR = 0
PRECIO_ESCUDO = 0
PRECIO_PISTOLA = 0
PRECIO_ESPADA = 0
ultima_direccion_x = 0
DURACION_ESCUDO = 0
duracion_partida = 0
escudo_sprite: Sprite = None
bg_sprite: Sprite = None
tiempo_decision = 0
char_name = ""
enemy_status = None
max_intentos = 0

moneda2 = None

duracion_partida = 180
DURACION_ESCUDO = 20000
ultima_direccion_x = 1
PRECIO_ESPADA = 50
PRECIO_PISTOLA = 75
PRECIO_ESCUDO = 100
MONEDA_VALOR = 10
KILL_BONUS = 50
GAME_STATE_INTRO = -1
GAME_STATE_CHAR_STORY = 4
GAME_STATE_NAME_INPUT = 5
GAME_STATE_JIGSAW_MESSAGE = 6
GAME_STATE_TUTORIAL = 7
velocidad_enemigo = 55
enemigos_intervalo = 30000
dificultad = "FACIL"
max_enemics = 6
GAME_STATE_CHAR_SELECT = 1
GAME_STATE_NAME_INPUT = 2
GAME_STATE_PLAYING = 3
game_state = GAME_STATE_MENU
player_name = "HUNTER"
game_time = 180
pantalla = "joc"
mapaJoc = False
cooldown_minimo_ataque = 400
cooldown_minimo_dodge = 500

scene.set_background_color(0)
show_main_menu()

def on_on_update():
    global tiempo_ultimo_disparo, ultimo_ataque, projectile
    mode_attack()
    update_escudo()
    if controller.B.is_pressed() and game_state == GAME_STATE_PLAYING and player_sprite:
        if game.runtime() - ultimo_ataque < cooldown_minimo_ataque:
            return
        if arma_equipada == "pistola":
            if game.runtime() - tiempo_ultimo_disparo < 500:
                return
            tiempo_ultimo_disparo = game.runtime()
            ultimo_ataque = game.runtime()
            vx = ultima_direccion_x * 200
            vy = ultima_direccion_y * 200
            imagen_bala = None
            if ultima_direccion_x > 0:
                imagen_bala = assets.image("""
                    bullet_right
                    """)
            elif ultima_direccion_x < 0:
                imagen_bala = assets.image("""
                    bullet_left
                    """)
            elif ultima_direccion_y > 0:
                imagen_bala = assets.image("""
                    bullet_down
                    """)
            else:
                imagen_bala = assets.image("""
                    bullet_up
                    """)
            projectile = sprites.create_projectile_from_sprite(imagen_bala, player_sprite, vx, vy)
            sprites.set_data_number(projectile, "damage", 1)
            music.play(music.melody_playable(music.pew_pew),
                music.PlaybackMode.IN_BACKGROUND)
        elif arma_equipada == "espada":
            if game.runtime() - tiempo_ultimo_disparo < 800:
                return
            tiempo_ultimo_disparo = game.runtime()
            ultimo_ataque = game.runtime()
            offset_x = 0
            offset_y = 0
            if ultima_direccion_x > 0:
                espada = sprites.create(assets.image("""
                        sword_swing_right
                        """),
                    SpriteKind.projectile)
                offset_x = 16
            elif ultima_direccion_x < 0:
                espada = sprites.create(assets.image("""
                        sword_swing_left
                        """),
                    SpriteKind.projectile)
                offset_x = -16
            elif ultima_direccion_y > 0:
                espada = sprites.create(assets.image("""
                        sword_swing_up
                        """),
                    SpriteKind.projectile)
                offset_y = 16
            else:
                espada = sprites.create(assets.image("""
                        sword_swing_up
                        """),
                    SpriteKind.projectile)
                offset_y = -16
            espada.set_position(player_sprite.x + offset_x, player_sprite.y + offset_y)
            espada.lifespan = 200
            sprites.set_data_number(espada, "damage", 2)
        elif arma_equipada == "escudo" and not (escudo_activo):
            activar_escudo()
game.on_update(on_on_update)

def on_forever():
    global mapaJoc
    if mapaJoc:
        mapaJoc = False
        tiles.set_current_tilemap(tilemap("""
            mapa
            """))
        cargar_coordenadas_mapa()
        start_gameplay()
        if player_sprite:
            tiles.place_on_random_tile(player_sprite, assets.tile("""
                stage
                """))
            controller.move_sprite(player_sprite, 100, 100)
            scene.camera_follow_sprite(player_sprite)
    spawner_enemics()
    pause(100)
forever(on_forever)
