namespace SpriteKind {
    export const moneda = SpriteKind.create()
    export const enemic = SpriteKind.create()
    export const NPC_Doctor = SpriteKind.create()
    export const NPC_Girl = SpriteKind.create()
    export const NPC_Prisoner = SpriteKind.create()
    export const NPC_Jigsaw = SpriteKind.create()
    export const Complete = SpriteKind.create()
    export const Dead = SpriteKind.create()
    export const ENEMIE_PROJECTILE = SpriteKind.create()
    export const item_suelo = SpriteKind.create()
    export const escudo_visual = SpriteKind.create()
    export const sierra = SpriteKind.create()
    export const palanca = SpriteKind.create()
    export const cursor = SpriteKind.create()
}

//  Listas de coordenadas
function configuracion_partida() {
    
    menu_configuracio = miniMenu.createMenu(miniMenu.createMenuItem("Tiempo de Partida"), miniMenu.createMenuItem("Dificultad"), miniMenu.createMenuItem("<- Volver"))
    menu = menu_configuracio
    estructura_menus()
    menu_configuracio.onButtonPressed(controller.A, function on_button_pressed(selection: any, selectedIndex: any) {
        menu_configuracio.close()
        if (selectedIndex == 0) {
            menu_temps2()
        } else if (selectedIndex == 1) {
            menu_dificultad2()
        } else {
            show_main_menu()
        }
        
    })
    menu_configuracio.onButtonPressed(controller.B, function on_button_pressed2(selection2: any, selectedIndex2: any) {
        menu_configuracio.close()
        show_main_menu()
    })
}

function mode_attack() {
    if (!player_sprite) {
        return
    }
    
    for (let un_enemigo of sprites.allOfKind(SpriteKind.enemic)) {
        un_enemigo.follow(player_sprite, velocidad_enemigo)
    }
}

sprites.onOverlap(SpriteKind.Player, SpriteKind.NPC_Doctor, function on_on_overlap(sprite2: Sprite, otherSprite2: Sprite) {
    let resultado: boolean;
    
    if (is_player_talking || !doctor_npc) {
        return
    }
    
    if (doctor_npc.kind() == SpriteKind.Complete || doctor_npc.kind() == SpriteKind.Dead) {
        return
    }
    
    if (controller.A.isPressed()) {
        is_player_talking = true
        resultado = minijuego_adivinanza_trampa()
        if (resultado) {
            doctor_npc.setKind(SpriteKind.Complete)
            info.changeScoreBy(150)
            npcs_saved += 1
        } else {
            doctor_npc.destroy()
            npcs_dead += 1
            info.changeScoreBy(-50)
        }
        
        is_player_talking = false
    }
    
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.ENEMIE_PROJECTILE, function on_on_overlap2(sprite_player: Sprite, sprite_proj: Sprite) {
    sprite_proj.destroy()
    if (dodge_roll || escudo_activo) {
        return
    }
    
    info.changeLifeBy(-1)
    if (player_statusbar) {
        player_statusbar.value = info.life()
    }
    
    scene.cameraShake(2, 100)
})
function show_character_story() {
    
    game_state = GAME_STATE_CHAR_STORY
    scene.setBackgroundColor(0)
    skip_dialogo = false
    if (selected_character == 0) {
        bg_sprite3 = sprites.create(assets.image`
            ander_bg
            `, SpriteKind.Food)
        bg_sprite3.setPosition(80, 60)
        bg_sprite3.z = -100
        game.showLongText("ANDER: 'Vi a un hombre morir...'", DialogLayout.Bottom)
        if (!controller.B.isPressed()) {
            game.showLongText("'...y no hice nada.'", DialogLayout.Bottom)
        }
        
    } else if (selected_character == 1) {
        bg_sprite3 = sprites.create(assets.image`
            kira_bg
            `, SpriteKind.Food)
        bg_sprite3.setPosition(80, 60)
        bg_sprite3.z = -100
        game.showLongText("KIRA: 'Manipule vidas sin remordimiento.'", DialogLayout.Bottom)
        if (!controller.B.isPressed()) {
            game.showLongText("'Alguien se suicido por mi culpa.'", DialogLayout.Bottom)
        }
        
    } else {
        game.showLongText("RANDOM: 'Siempre fui indiferente.'", DialogLayout.Bottom)
        if (!controller.B.isPressed()) {
            game.showLongText("'No es mi problema - decia.'", DialogLayout.Bottom)
        }
        
    }
    
    if (!controller.B.isPressed()) {
        game.showLongText("Y entonces... todo se volvio negro.", DialogLayout.Bottom)
    }
    
    if (bg_sprite3) {
        bg_sprite3.destroy()
    }
    
    show_jigsaw_message()
}

function activar_escudo() {
    
    if (arma_equipada != "escudo" || !player_sprite) {
        return
    }
    
    escudo_activo = true
    escudo_tiempo_inicio = game.runtime()
    escudo_sprite = sprites.create(assets.image`
            visual_shield
            `, SpriteKind.escudo_visual)
    escudo_sprite.setPosition(player_sprite.x, player_sprite.y)
    escudo_sprite.z = -1
    animation.runImageAnimation(escudo_sprite, assets.animation`
            visual_shield_animation
            `, 100, true)
    effects.starField.startScreenEffect()
}

sprites.onOverlap(SpriteKind.Player, SpriteKind.NPC_Girl, function on_on_overlap3(sprite: Sprite, otherSprite: Sprite) {
    let resultado2: boolean;
    
    if (is_player_talking || !girl_npc) {
        return
    }
    
    if (girl_npc.kind() == SpriteKind.Complete || girl_npc.kind() == SpriteKind.Dead) {
        return
    }
    
    if (controller.A.isPressed()) {
        is_player_talking = true
        resultado2 = minijuego_esquivar_sierras()
        if (resultado2) {
            girl_npc.setKind(SpriteKind.Complete)
            info.changeScoreBy(200)
            npcs_saved += 1
        } else {
            girl_npc.destroy()
            npcs_dead += 1
            info.changeScoreBy(-100)
        }
        
        is_player_talking = false
    }
    
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.enemic, function on_on_overlap4(sprite_proj2: Sprite, enemigo_sprite: Sprite) {
    let dano: number;
    
    sprite_proj2.destroy()
    enemy_status2 = statusbars.getStatusBarAttachedTo(StatusBarKind.Health, enemigo_sprite)
    if (enemy_status2) {
        dano = sprites.readDataNumber(sprite_proj2, "damage")
        if (dano == 0) {
            dano = 1
        }
        
        enemy_status2.value -= dano
        if (enemy_status2.value <= 0) {
            sprites.destroy(enemigo_sprite, effects.disintegrate, 500)
            info.changeScoreBy(KILL_BONUS)
        }
        
    }
    
})
function spawn_npcs_in_map() {
    
    if (npcs_coordenadas.length >= 3) {
        doctor_npc = sprites.create(assets.image`
                npc_doctor
                `, SpriteKind.NPC_Doctor)
        tiles.placeOnTile(doctor_npc, npcs_coordenadas[0])
        crear_status_bar(doctor_npc, 1, 2)
        girl_npc = sprites.create(assets.image`
            npc_girl
            `, SpriteKind.NPC_Girl)
        tiles.placeOnTile(girl_npc, npcs_coordenadas[1])
        crear_status_bar(girl_npc, 1, 2)
        prisoner_npc = sprites.create(assets.image`
                npc_prisoner
                `, SpriteKind.NPC_Prisoner)
        tiles.placeOnTile(prisoner_npc, npcs_coordenadas[2])
        crear_status_bar(prisoner_npc, 1, 2)
    } else {
        doctor_npc = sprites.create(assets.image`
                npc_doctor
                `, SpriteKind.NPC_Doctor)
        tiles.placeOnTile(doctor_npc, tiles.getTileLocation(5, 3))
        crear_status_bar(doctor_npc, 1, 2)
        girl_npc = sprites.create(assets.image`
            npc_girl
            `, SpriteKind.NPC_Girl)
        tiles.placeOnTile(girl_npc, tiles.getTileLocation(10, 5))
        crear_status_bar(girl_npc, 1, 2)
        prisoner_npc = sprites.create(assets.image`
                npc_prisoner
                `, SpriteKind.NPC_Prisoner)
        tiles.placeOnTile(prisoner_npc, tiles.getTileLocation(15, 7))
        crear_status_bar(prisoner_npc, 1, 2)
    }
    
}

controller.down.onEvent(ControllerButtonEvent.Pressed, function on_down_pressed() {
    
    ultima_direccion_x = 0
    ultima_direccion_y = 1
    if (game_state == GAME_STATE_PLAYING && player_sprite) {
        if (selected_character == 0) {
            animation.runImageAnimation(player_sprite, assets.animation`
                    character_ander_walking_down
                    `, 200, true)
        } else if (selected_character == 1) {
            animation.runImageAnimation(player_sprite, assets.animation`
                    character_kira_walking_down
                    `, 200, true)
        } else {
            animar_random_walking("down")
        }
        
    }
    
})
function menu_temps2() {
    
    menu_temps = miniMenu.createMenu(miniMenu.createMenuItem("3 minutos"), miniMenu.createMenuItem("5 minutos"), miniMenu.createMenuItem("7 minutos"), miniMenu.createMenuItem("<- Volver"))
    menu = menu_temps
    estructura_menus()
    menu_temps.onButtonPressed(controller.A, function on_button_pressed3(selection3: any, selectedIndex3: any) {
        
        menu_temps.close()
        if (selectedIndex3 == 0) {
            duracion_partida = 180
            game.splash("3 minutos", "")
        } else if (selectedIndex3 == 1) {
            duracion_partida = 300
            game.splash("5 minutos", "")
        } else if (selectedIndex3 == 2) {
            duracion_partida = 420
            game.splash("7 minutos", "")
        }
        
        configuracion_partida()
    })
    menu_temps.onButtonPressed(controller.B, function on_button_pressed4(selection4: any, selectedIndex4: any) {
        menu_temps.close()
        configuracion_partida()
    })
}

function soltar_arma_actual() {
    
    if (arma_equipada == "") {
        return
    }
    
    if (arma_equipada == "espada") {
        item_suelo2 = sprites.create(assets.image`
                sword_swing_right
                `, SpriteKind.item_suelo)
        sprites.setDataString(item_suelo2, "tipo", "espada")
    } else if (arma_equipada == "pistola") {
        item_suelo2 = sprites.create(assets.image`
                gun_right
                `, SpriteKind.item_suelo)
        sprites.setDataString(item_suelo2, "tipo", "pistola")
    } else if (arma_equipada == "escudo") {
        item_suelo2 = sprites.create(assets.image`
            shield
            `, SpriteKind.item_suelo)
        sprites.setDataString(item_suelo2, "tipo", "escudo")
    }
    
    if (item_suelo2 && player_sprite) {
        item_suelo2.setPosition(player_sprite.x, player_sprite.y)
    }
    
    arma_equipada = ""
}

function comprar_arma(nombre_arma: string, precio: number, imagen_arma: Image) {
    
    if (arma_equipada != "") {
        soltar_arma_actual()
    }
    
    info.changeScoreBy(0 - precio)
    score += 0 - precio
    arma_equipada = nombre_arma
    if (arma_hud) {
        arma_hud.destroy()
    }
    
    arma_hud = sprites.create(imagen_arma, SpriteKind.Food)
    arma_hud.setFlag(SpriteFlag.RelativeToCamera, true)
    arma_hud.setPosition(20, 105)
    game.splash("" + nombre_arma + " EQUIPADA", "")
}

function spawner_enemics() {
    
    if (game_state != GAME_STATE_PLAYING || !player_sprite) {
        return
    }
    
    if (sprites.allOfKind(SpriteKind.enemic).length >= max_enemics) {
        return
    }
    
    if (game.runtime() - ultimo_enemigo2 < enemigos_intervalo) {
        return
    }
    
    ultimo_enemigo2 = game.runtime()
    enemic1 = sprites.create(assets.image`
        enemy_bat
        `, SpriteKind.enemic)
    if (enemy_coordenadas.length > 0) {
        tiles.placeOnTile(enemic1, enemy_coordenadas[enemy_spawn_index % enemy_coordenadas.length])
        enemy_spawn_index += 1
    } else {
        enemic1.setPosition(randint(20, 140), randint(20, 100))
    }
    
    enemic1.follow(player_sprite, velocidad_enemigo)
    if (ultima_direccion_x > 0) {
        animation.runImageAnimation(enemic1, assets.animation`
                enemy_bat_move_right
                `, 200, true)
    } else {
        animation.runImageAnimation(enemic1, assets.animation`
                enemy_bat_move_left
                `, 200, true)
    }
    
    crear_status_bar(enemic1, 3, 7)
}

function show_saw_intro() {
    
    skip_dialogo = false
    sprites.destroyAllSpritesOfKind(SpriteKind.Food)
    bg_sprite = sprites.create(assets.image`
        jigsaw_bg
        `, SpriteKind.Food)
    bg_sprite.setPosition(80, 60)
    bg_sprite.z = -100
    bg_sprite.setFlag(SpriteFlag.Ghost, true)
    scene.setBackgroundColor(1)
    game.splash("B: Saltar dialogos", "A: Continuar")
    if (!skip_dialogo) {
        game.showLongText("Hola... Quiero jugar un juego.", DialogLayout.Bottom)
        if (controller.B.isPressed()) {
            skip_dialogo = true
        }
        
    }
    
    if (!skip_dialogo) {
        game.showLongText("Has ignorado el sufrimiento ajeno.", DialogLayout.Bottom)
        if (controller.B.isPressed()) {
            skip_dialogo = true
        }
        
    }
    
    if (!skip_dialogo) {
        game.showLongText("Ahora deberas demostrar que valoras la vida.", DialogLayout.Bottom)
        if (controller.B.isPressed()) {
            skip_dialogo = true
        }
        
    }
    
    if (!skip_dialogo) {
        game.showLongText("Tienes 180 segundos.", DialogLayout.Bottom)
        if (controller.B.isPressed()) {
            skip_dialogo = true
        }
        
    }
    
    if (!skip_dialogo) {
        game.showLongText("Vive o muere. Haz tu eleccion.", DialogLayout.Bottom)
    }
    
    if (bg_sprite) {
        bg_sprite.destroy()
    }
    
    show_character_select()
}

controller.right.onEvent(ControllerButtonEvent.Pressed, function on_right_pressed() {
    
    ultima_direccion_x = 1
    ultima_direccion_y = 0
    if (game_state == GAME_STATE_PLAYING && player_sprite) {
        if (selected_character == 0) {
            animation.runImageAnimation(player_sprite, assets.animation`
                    character_ander_walking_right
                    `, 200, true)
        } else if (selected_character == 1) {
            animation.runImageAnimation(player_sprite, assets.animation`
                    character_kira_walking_right
                    `, 200, true)
        } else {
            animar_random_walking("right")
        }
        
    }
    
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function on_left_pressed() {
    
    ultima_direccion_x = -1
    ultima_direccion_y = 0
    if (game_state == GAME_STATE_PLAYING && player_sprite) {
        if (selected_character == 0) {
            animation.runImageAnimation(player_sprite, assets.animation`
                    character_ander_walking_left
                    `, 200, true)
        } else if (selected_character == 1) {
            animation.runImageAnimation(player_sprite, assets.animation`
                    character_kira_walking_left
                    `, 200, true)
        } else {
            animar_random_walking("left")
        }
        
    }
    
})
function crear_status_bar(sprite3: Sprite, max_vida: number, color2: number): StatusBarSprite {
    
    status_bar = statusbars.create(20, 3, StatusBarKind.Health)
    status_bar.attachToSprite(sprite3)
    status_bar.max = max_vida
    status_bar.value = max_vida
    status_bar.setColor(color2, 15)
    status_bar.setBarBorder(1, 0)
    return status_bar
}

sprites.onOverlap(SpriteKind.Player, SpriteKind.NPC_Prisoner, function on_on_overlap5(sprite4: Sprite, otherSprite3: Sprite) {
    let resultado3: boolean;
    
    if (is_player_talking || !prisoner_npc) {
        return
    }
    
    if (prisoner_npc.kind() == SpriteKind.Complete || prisoner_npc.kind() == SpriteKind.Dead) {
        return
    }
    
    if (controller.A.isPressed()) {
        is_player_talking = true
        resultado3 = minijuego_desactiva_trampas()
        if (resultado3) {
            prisoner_npc.setKind(SpriteKind.Complete)
            info.changeScoreBy(150)
            npcs_saved += 1
        } else {
            prisoner_npc.destroy()
            npcs_dead += 1
            info.changeScoreBy(-50)
        }
        
        is_player_talking = false
    }
    
})
function mostrar_pregunta_tutorial() {
    
    menu_tutorial = miniMenu.createMenu(miniMenu.createMenuItem("Ver Tutorial"), miniMenu.createMenuItem("Saltar y Jugar"), miniMenu.createMenuItem("<- Volver a Personajes"))
    menu_tutorial.setPosition(80, 60)
    menu_tutorial.onButtonPressed(controller.A, function on_button_pressed5(selection5: any, selectedIndex5: any) {
        
        menu_tutorial.close()
        if (selectedIndex5 == 0) {
            mostrar_tutorial()
            mapaJoc = true
        } else if (selectedIndex5 == 1) {
            mapaJoc = true
        } else {
            show_character_select()
        }
        
    })
    menu_tutorial.onButtonPressed(controller.B, function on_button_pressed6(selection6: any, selectedIndex6: any) {
        menu_tutorial.close()
        show_character_select()
    })
}

controller.A.onEvent(ControllerButtonEvent.Pressed, function on_a_pressed() {
    
    if (game_state != GAME_STATE_PLAYING) {
        return
    }
    
    if (game.runtime() - ultimo_dodge < cooldown_minimo_dodge) {
        return
    }
    
    ultimo_dodge = game.runtime()
    dodge_roll = true
    scene.cameraShake(2, 200)
    pause(500)
    dodge_roll = false
})
info.onCountdownEnd(function on_countdown_end() {
    
    scene.setBackgroundColor(0)
    bg_sprite = sprites.create(assets.image`
        jigsaw_bg
        `, SpriteKind.Food)
    bg_sprite.setPosition(80, 60)
    bg_sprite.z = -100
    game.showLongText("El tiempo se agoto.", DialogLayout.Bottom)
    if (score >= 500 && npcs_dead == 0) {
        game.showLongText("JIGSAW: 'Impresionante! Eres libre.'", DialogLayout.Bottom)
        game.splash("FINAL PERFECTO", "" + ("" + score) + " pts")
    } else if (score >= 300) {
        game.showLongText("JIGSAW: 'Sobreviviste... pero a que costo.'", DialogLayout.Bottom)
        game.splash("FINAL BUENO", "" + ("" + score) + " pts")
    } else {
        game.showLongText("JIGSAW: 'Fallaste.'", DialogLayout.Bottom)
        scene.cameraShake(8, 2000)
        game.splash("GAME OVER", "" + ("" + score) + " pts")
    }
    
    if (bg_sprite) {
        bg_sprite.destroy()
    }
    
    pause(2000)
    game.reset()
})
function minijuego_esquivar_sierras(): boolean {
    let shuriken: Sprite;
    
    game.showLongText("NINA: 'El antidoto esta al otro lado...'", DialogLayout.Bottom)
    game.splash("ESQUIVA!", "Muevete con <- ->")
    jugador_temp = sprites.create(assets.image`
            character_ander
            `, SpriteKind.Player)
    jugador_temp.setPosition(80, 100)
    jugador_temp.setStayInScreen(true)
    controller.moveSprite(jugador_temp, 120, 0)
    golpeado = false
    shurikens_esquivados = 0
    contador = textsprite.create("0/8", 0, 1)
    contador.setFlag(SpriteFlag.RelativeToCamera, true)
    contador.setPosition(80, 10)
    for (let index = 0; index < 8; index++) {
        shuriken = sprites.create(assets.image`
            shuriken
            `, SpriteKind.sierra)
        shuriken.setPosition(randint(20, 140), 0)
        shuriken.setVelocity(0, 80)
        animation.runImageAnimation(shuriken, assets.animation`
                shuriken_animation_rotation
                `, 100, true)
        pause(800)
        if (shuriken.overlapsWith(jugador_temp)) {
            golpeado = true
            scene.cameraShake(4, 500)
            shuriken.destroy()
            break
        }
        
        if (shuriken.y > 120) {
            shurikens_esquivados += 1
            contador.setText("" + ("" + shurikens_esquivados) + "/8")
        }
        
        shuriken.destroy()
    }
    jugador_temp.destroy()
    contador.destroy()
    sprites.destroyAllSpritesOfKind(SpriteKind.sierra)
    if (!golpeado && shurikens_esquivados >= 6) {
        game.showLongText("Salvaste a Emma!", DialogLayout.Bottom)
        return true
    } else {
        game.showLongText("Emma murio...", DialogLayout.Bottom)
        return false
    }
    
}

sprites.onOverlap(SpriteKind.Player, SpriteKind.item_suelo, function on_on_overlap6(sprite_jugador: Sprite, item: Sprite) {
    
    if (!controller.A.isPressed()) {
        return
    }
    
    tipo_arma = sprites.readDataString(item, "tipo")
    if (arma_equipada != "") {
        soltar_arma_actual()
    }
    
    arma_equipada = tipo_arma
    if (arma_hud) {
        arma_hud.destroy()
    }
    
    if (tipo_arma == "espada") {
        imagen_arma2 = assets.image`
            sword_swing_right
            `
    } else if (tipo_arma == "pistola") {
        imagen_arma2 = assets.image`
            gun_right
            `
    } else if (tipo_arma == "escudo") {
        imagen_arma2 = assets.image`
            shield
            `
    }
    
    if (imagen_arma2) {
        arma_hud = sprites.create(imagen_arma2, SpriteKind.Food)
        arma_hud.setFlag(SpriteFlag.RelativeToCamera, true)
        arma_hud.setPosition(20, 105)
    }
    
    item.destroy()
})
//  ========== GAMEPLAY ==========
function start_gameplay() {
    
    ultimo_enemigo = game.runtime()
    info.startCountdown(duracion_partida)
    game_state = GAME_STATE_PLAYING
    score = 0
    sprites.destroyAllSpritesOfKind(SpriteKind.Player)
    sprites.destroyAllSpritesOfKind(SpriteKind.Food)
    info.setLife(5)
    arma_equipada = "pistola"
    arma_hud = sprites.create(assets.image`
        gun_right
        `, SpriteKind.Food)
    arma_hud.setFlag(SpriteFlag.RelativeToCamera, true)
    arma_hud.setPosition(20, 105)
    arma_hud.z = 100
    if (selected_character == 0) {
        player_sprite = sprites.create(assets.image`
                character_ander
                `, SpriteKind.Player)
    } else if (selected_character == 1) {
        player_sprite = sprites.create(assets.image`
                character_kira
                `, SpriteKind.Player)
    } else {
        player_sprite = crear_jugador_random()
    }
    
    player_sprite.setStayInScreen(true)
    player_statusbar = crear_status_bar(player_sprite, 5, 2)
    spawn_npcs_in_map()
}

function animar_random_walking(direccion: string) {
    if (!player_sprite) {
        return
    }
    
    if (randomIndex == 1) {
        if (direccion == "down") {
            animation.runImageAnimation(player_sprite, assets.animation`
                    random1_walking_down
                    `, 200, true)
        } else if (direccion == "up") {
            animation.runImageAnimation(player_sprite, assets.animation`
                    random1_walking_up
                    `, 200, true)
        } else if (direccion == "left") {
            animation.runImageAnimation(player_sprite, assets.animation`
                    random1_walking_left
                    `, 200, true)
        } else if (direccion == "right") {
            animation.runImageAnimation(player_sprite, assets.animation`
                    random1_walking_right
                    `, 200, true)
        }
        
    } else if (randomIndex == 2) {
        if (direccion == "down") {
            animation.runImageAnimation(player_sprite, assets.animation`
                    random2_walking_down
                    `, 200, true)
        } else if (direccion == "up") {
            animation.runImageAnimation(player_sprite, assets.animation`
                    random2_walking_up
                    `, 200, true)
        } else if (direccion == "left") {
            animation.runImageAnimation(player_sprite, assets.animation`
                    random2_walking_left
                    `, 200, true)
        } else if (direccion == "right") {
            animation.runImageAnimation(player_sprite, assets.animation`
                    random2_walking_right
                    `, 200, true)
        }
        
    } else if (randomIndex == 3) {
        if (direccion == "down") {
            animation.runImageAnimation(player_sprite, assets.animation`
                    random3_walking_down
                    `, 200, true)
        } else if (direccion == "up") {
            animation.runImageAnimation(player_sprite, assets.animation`
                    random3_walking_up
                    `, 200, true)
        } else if (direccion == "left") {
            animation.runImageAnimation(player_sprite, assets.animation`
                    random3_walking_left
                    `, 200, true)
        } else if (direccion == "right") {
            animation.runImageAnimation(player_sprite, assets.animation`
                    random3_walking_right
                    `, 200, true)
        }
        
    } else if (randomIndex == 4) {
        if (direccion == "down") {
            animation.runImageAnimation(player_sprite, assets.animation`
                    random4_walking_down
                    `, 200, true)
        } else if (direccion == "up") {
            animation.runImageAnimation(player_sprite, assets.animation`
                    random4_walking_up
                    `, 200, true)
        } else if (direccion == "left") {
            animation.runImageAnimation(player_sprite, assets.animation`
                    random4_walking_left
                    `, 200, true)
        } else if (direccion == "right") {
            animation.runImageAnimation(player_sprite, assets.animation`
                    random4_walking_right
                    `, 200, true)
        }
        
    } else if (direccion == "down") {
        animation.runImageAnimation(player_sprite, assets.animation`
                random5_walking_down
                `, 200, true)
    } else if (direccion == "up") {
        animation.runImageAnimation(player_sprite, assets.animation`
                random5_walking_up
                `, 200, true)
    } else if (direccion == "left") {
        animation.runImageAnimation(player_sprite, assets.animation`
                random5_walking_left
                `, 200, true)
    } else if (direccion == "right") {
        animation.runImageAnimation(player_sprite, assets.animation`
                random5_walking_right
                `, 200, true)
    }
    
}

function minijuego_adivinanza_trampa(): boolean {
    
    game.showLongText("DOCTOR: 'Tengo una BOMBA! Ayudame!'", DialogLayout.Bottom)
    game.showLongText("Ves 3 cables...", DialogLayout.Bottom)
    menu_adivinanza = miniMenu.createMenu(miniMenu.createMenuItem("Cable ROJO"), miniMenu.createMenuItem("Cable AZUL"), miniMenu.createMenuItem("Cable VERDE"), miniMenu.createMenuItem("NO CORTAR NINGUNO"))
    menu_adivinanza.setPosition(80, 60)
    respuesta_correcta = -1
    menu_adivinanza.onButtonPressed(controller.A, function on_button_pressed7(selection7: any, selectedIndex7: number) {
        
        respuesta_correcta = selectedIndex7
        menu_adivinanza.close()
    })
    tiempo_inicio = game.runtime()
    while (respuesta_correcta == -1 && game.runtime() - tiempo_inicio < 15000) {
        pause(100)
    }
    if (respuesta_correcta == 3) {
        game.showLongText("Correcto! Me salvaste!", DialogLayout.Bottom)
        return true
    } else {
        game.showLongText("*EXPLOSION*", DialogLayout.Bottom)
        scene.cameraShake(8, 1000)
        return false
    }
    
}

function crear_jugador_random(): Sprite {
    
    randomIndex = randint(1, 5)
    if (randomIndex == 1) {
        return sprites.create(assets.image`
            random1
            `, SpriteKind.Player)
    } else if (randomIndex == 2) {
        return sprites.create(assets.image`
            random2
            `, SpriteKind.Player)
    } else if (randomIndex == 3) {
        return sprites.create(assets.image`
            random3
            `, SpriteKind.Player)
    } else if (randomIndex == 4) {
        return sprites.create(assets.image`
            random4
            `, SpriteKind.Player)
    } else {
        return sprites.create(assets.image`
            random5
            `, SpriteKind.Player)
    }
    
}

function menu_dificultad2() {
    
    menu_dificultad = miniMenu.createMenu(miniMenu.createMenuItem("Facil"), miniMenu.createMenuItem("Dificil"), miniMenu.createMenuItem("<- Volver"))
    menu = menu_dificultad
    estructura_menus()
    menu_dificultad.onButtonPressed(controller.A, function on_button_pressed8(selection8: any, selectedIndex8: any) {
        
        menu_dificultad.close()
        if (selectedIndex8 == 0) {
            dificultad = "FACIL"
            enemigos_intervalo = 30000
            velocidad_enemigo = 45
            max_enemics = 4
        } else if (selectedIndex8 == 1) {
            dificultad = "DIFICIL"
            enemigos_intervalo = 15000
            velocidad_enemigo = 85
            max_enemics = 10
        }
        
        configuracion_partida()
    })
    menu_dificultad.onButtonPressed(controller.B, function on_button_pressed9(selection9: any, selectedIndex9: any) {
        menu_dificultad.close()
        configuracion_partida()
    })
}

controller.up.onEvent(ControllerButtonEvent.Pressed, function on_up_pressed() {
    
    ultima_direccion_x = 0
    ultima_direccion_y = -1
    if (game_state == GAME_STATE_PLAYING && player_sprite) {
        if (selected_character == 0) {
            animation.runImageAnimation(player_sprite, assets.animation`
                    character_ander_walking_up
                    `, 200, true)
        } else if (selected_character == 1) {
            animation.runImageAnimation(player_sprite, assets.animation`
                    character_kira_walking_up
                    `, 200, true)
        } else {
            animar_random_walking("up")
        }
        
    }
    
})
function cargar_coordenadas_mapa() {
    
    npcs_coordenadas = tiles.getTilesByType(sprites.dungeon.collectibleInsignia)
    cofres_coordenadas = tiles.getTilesByType(sprites.dungeon.chestClosed)
    enemy_coordenadas = tiles.getTilesByType(sprites.dungeon.collectibleBlueCrystal)
    floor1_coordenadas = tiles.getTilesByType(sprites.dungeon.floorMixed)
    floor2_coordenadas = tiles.getTilesByType(sprites.dungeon.floorDark5)
}

function show_main_menu() {
    
    game_state = GAME_STATE_MENU
    skip_dialogo = false
    sprites.destroyAllSpritesOfKind(SpriteKind.Food)
    bg_sprite = sprites.create(assets.image`
        scary_bg
        `, SpriteKind.Food)
    bg_sprite.setPosition(80, 60)
    bg_sprite.z = -100
    bg_sprite.setFlag(SpriteFlag.Ghost, true)
    game.splash("PLAY OR DIE - JIGSAW", "")
    main_menu = miniMenu.createMenu(miniMenu.createMenuItem("HISTORIA"), miniMenu.createMenuItem("CONFIGURACION"), miniMenu.createMenuItem("YOU VS ALL"), miniMenu.createMenuItem("CREDITOS"))
    menu = main_menu
    estructura_menus()
    main_menu.setStyleProperty(miniMenu.StyleKind.Default, miniMenu.StyleProperty.Background, 2)
    main_menu.setStyleProperty(miniMenu.StyleKind.Default, miniMenu.StyleProperty.Foreground, 0)
    main_menu.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Background, 15)
    main_menu.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Foreground, 2)
    main_menu.onButtonPressed(controller.A, function on_button_pressed10(selection10: any, selectedIndex10: any) {
        main_menu.close()
        if (bg_sprite) {
            bg_sprite.destroy()
        }
        
        if (selectedIndex10 == 0) {
            show_saw_intro()
        } else if (selectedIndex10 == 1) {
            configuracion_partida()
        } else if (selectedIndex10 == 2) {
            game.splash("VERSUS", "Proximamente!")
            show_main_menu()
        } else if (selectedIndex10 == 3) {
            game.showLongText("PLAY OR DIE - JIGSAW", DialogLayout.Bottom)
            game.showLongText("Creado por: Evelyn y Mariona", DialogLayout.Bottom)
            game.showLongText("DAM 2026 - La Salle Gracia", DialogLayout.Bottom)
            show_main_menu()
        }
        
    })
}

game.onUpdateInterval(5000, function on_update_interval() {
    
    if (game_state != GAME_STATE_PLAYING) {
        return
    }
    
    moneda22 = sprites.create(assets.image`
        item_coin
        `, SpriteKind.moneda)
    moneda22.z = 10
    animation.runImageAnimation(moneda22, assets.animation`
            item_coin_rotating
            `, 200, true)
    tiles.placeOnRandomTile(moneda22, sprites.dungeon.floorDark5)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.moneda, function on_on_overlap7(player22: Sprite, coin: Sprite) {
    
    score += MONEDA_VALOR
    info.changeScoreBy(MONEDA_VALOR)
    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
    sprites.destroy(coin, effects.spray, 200)
})
function mostrar_tutorial() {
    
    if (tutorial_mostrado) {
        return
    }
    
    tutorial_mostrado = true
    game.showLongText("CONTROLES", DialogLayout.Bottom)
    if (controller.B.isPressed()) {
        return
    }
    
    game.showLongText("FLECHAS: Moverte", DialogLayout.Bottom)
    if (controller.B.isPressed()) {
        return
    }
    
    game.showLongText("A: Dodge + Interactuar NPCs", DialogLayout.Bottom)
    if (controller.B.isPressed()) {
        return
    }
    
    game.showLongText("B: Atacar (con arma)", DialogLayout.Bottom)
    if (controller.B.isPressed()) {
        return
    }
    
    game.showLongText("OBJETIVO: Salva 3 NPCs, sobrevive!", DialogLayout.Bottom)
}

function show_character_select() {
    
    game_state = GAME_STATE_CHAR_SELECT
    sprites.destroyAllSpritesOfKind(SpriteKind.Player)
    sprites.destroyAllSpritesOfKind(SpriteKind.Food)
    bg_sprite2 = sprites.create(assets.image`
        scary_bg
        `, SpriteKind.Food)
    bg_sprite2.setPosition(80, 60)
    bg_sprite2.z = -100
    bg_sprite2.setFlag(SpriteFlag.Ghost, true)
    game.splash("Elige personaje", "B: Volver al menu")
    char_menu = miniMenu.createMenu(miniMenu.createMenuItem("ANDER", assets.image`
            character_ander
            `), miniMenu.createMenuItem("KIRA", assets.image`
            character_kira
            `), miniMenu.createMenuItem("RANDOM", assets.image`
            random1
            `), miniMenu.createMenuItem("<- Volver al Menu"))
    char_menu.setPosition(80, 64)
    char_menu.setStyleProperty(miniMenu.StyleKind.Default, miniMenu.StyleProperty.Background, 2)
    char_menu.setStyleProperty(miniMenu.StyleKind.Default, miniMenu.StyleProperty.Foreground, 0)
    char_menu.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Background, 15)
    char_menu.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Foreground, 2)
    char_menu.onButtonPressed(controller.A, function on_button_pressed11(selection11: any, selectedIndex11: number) {
        
        char_menu.close()
        if (bg_sprite2) {
            bg_sprite2.destroy()
        }
        
        if (selectedIndex11 == 3) {
            show_main_menu()
        } else {
            selected_character = selectedIndex11
            show_character_story()
        }
        
    })
    char_menu.onButtonPressed(controller.B, function on_button_pressed12(selection12: any, selectedIndex12: any) {
        char_menu.close()
        if (bg_sprite2) {
            bg_sprite2.destroy()
        }
        
        show_main_menu()
    })
}

function desactivar_escudo() {
    
    escudo_activo = false
    if (escudo_sprite) {
        escudo_sprite.destroy()
        escudo_sprite = null
    }
    
    arma_equipada = ""
    if (arma_hud) {
        arma_hud.destroy()
        arma_hud = sprites.create(assets.image`
                hud_empty_weapon
                `, SpriteKind.Food)
        arma_hud.setFlag(SpriteFlag.RelativeToCamera, true)
        arma_hud.setPosition(20, 105)
    }
    
}

function show_jigsaw_message() {
    
    game_state = GAME_STATE_JIGSAW_MESSAGE
    scene.setBackgroundColor(0)
    skip_dialogo = false
    bg_sprite = sprites.create(assets.image`
        jigsaw_bg
        `, SpriteKind.Food)
    bg_sprite.setPosition(80, 60)
    bg_sprite.z = -100
    bg_sprite.setFlag(SpriteFlag.Ghost, true)
    character_names = ["Ander", "Kira", "Random"]
    char_name2 = character_names[selected_character]
    game.showLongText("JIGSAW: 'Hola, " + char_name2 + ".'", DialogLayout.Bottom)
    if (!controller.B.isPressed()) {
        game.showLongText("'Tienes 180 segundos para redimirte.'", DialogLayout.Bottom)
    }
    
    if (!controller.B.isPressed()) {
        game.showLongText("'Salva a los inocentes... y sobrevive.'", DialogLayout.Bottom)
    }
    
    if (!controller.B.isPressed()) {
        game.showLongText("Vive o muere. Haz tu eleccion.", DialogLayout.Bottom)
    }
    
    if (bg_sprite) {
        bg_sprite.destroy()
        bg_sprite = null
    }
    
    mostrar_pregunta_tutorial()
}

sprites.onOverlap(SpriteKind.Player, SpriteKind.enemic, function on_on_overlap8(player2: Sprite, enemy: Sprite) {
    
    if (dodge_roll || escudo_activo) {
        return
    }
    
    info.changeLifeBy(-1)
    if (player_statusbar) {
        player_statusbar.value = info.life()
    }
    
    scene.cameraShake(4, 500)
    distancia_repulsion = 15
    nueva_x = player2.x
    nueva_y = player2.y
    if (player2.x > enemy.x) {
        nueva_x = player2.x + distancia_repulsion
    } else {
        nueva_x = player2.x - distancia_repulsion
    }
    
    if (player2.y > enemy.y) {
        nueva_y = player2.y + distancia_repulsion / 2
    } else {
        nueva_y = player2.y - distancia_repulsion / 2
    }
    
    nueva_loc = tiles.getTileLocation(Math.trunc(nueva_x / 16), Math.trunc(nueva_y / 16))
    if (nueva_x > 8 && nueva_x < 152 && nueva_y > 8 && nueva_y < 112) {
        if (!tiles.tileAtLocationIsWall(nueva_loc)) {
            player2.x = nueva_x
            player2.y = nueva_y
        } else if (player2.x > enemy.x) {
            player2.x = Math.min(player2.x + 5, 150)
        } else {
            player2.x = Math.max(player2.x - 5, 10)
        }
        
    }
    
})
function estructura_menus() {
    menu.setPosition(80, 60)
    menu.setMenuStyleProperty(miniMenu.MenuStyleProperty.Width, 120)
    menu.setMenuStyleProperty(miniMenu.MenuStyleProperty.Height, 60)
    menu.setStyleProperty(miniMenu.StyleKind.Default, miniMenu.StyleProperty.Background, 15)
    menu.setStyleProperty(miniMenu.StyleKind.Default, miniMenu.StyleProperty.Foreground, 1)
    menu.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Background, 8)
    menu.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Foreground, 1)
}

function update_escudo() {
    if (!escudo_activo) {
        return
    }
    
    if (escudo_sprite && player_sprite) {
        escudo_sprite.setPosition(player_sprite.x, player_sprite.y)
    }
    
    if (game.runtime() - escudo_tiempo_inicio >= DURACION_ESCUDO) {
        desactivar_escudo()
    }
    
}

scene.onOverlapTile(SpriteKind.Player, sprites.dungeon.chestClosed, function on_overlap_tile(sprite_jugador2: Sprite, cofre: tiles.Location) {
    
    if (!controller.A.isPressed()) {
        return
    }
    
    tiles.setTileAt(cofre, sprites.dungeon.chestOpen)
    game.showLongText("Cofre! Tu dinero: $" + ("" + ("" + score)), DialogLayout.Bottom)
    menu_armas = miniMenu.createMenu(miniMenu.createMenuItem("Espada ($50)", assets.image`
                sword_swing_right
                `), miniMenu.createMenuItem("Pistola ($75)", assets.image`
            gun_right
            `), miniMenu.createMenuItem("Escudo ($100)", assets.image`
            shield
            `), miniMenu.createMenuItem("Cancelar"))
    menu_armas.setPosition(80, 60)
    menu_armas.onButtonPressed(controller.A, function on_button_pressed13(selection13: any, selectedIndex13: any) {
        menu_armas.close()
        if (selectedIndex13 == 0 && score >= PRECIO_ESPADA) {
            comprar_arma("espada", PRECIO_ESPADA, assets.image`
                    sword_swing_right
                    `)
        } else if (selectedIndex13 == 1 && score >= PRECIO_PISTOLA) {
            comprar_arma("pistola", PRECIO_PISTOLA, assets.image`
                    gun_right
                    `)
        } else if (selectedIndex13 == 2 && score >= PRECIO_ESCUDO) {
            comprar_arma("escudo", PRECIO_ESCUDO, assets.image`
                    shield
                    `)
        } else if (selectedIndex13 < 3) {
            game.splash("DINERO INSUFICIENTE", "")
        }
        
    })
    menu_armas.onButtonPressed(controller.B, function on_button_pressed14(selection14: any, selectedIndex14: any) {
        menu_armas.close()
    })
})
function minijuego_desactiva_trampas(): boolean {
    let palanca2: Sprite;
    let num: TextSprite;
    
    let numeros_sprites : TextSprite[] = []
    let palancas : Sprite[] = []
    game.showLongText("PRISIONERO: 'Las cadenas me aplastan!'", DialogLayout.Bottom)
    game.showLongText("PISTA: Palancas PARES liberan", DialogLayout.Bottom)
    estados_palancas = [false, false, false, false, false]
    cursor_pos = 0
    intentos = 0
    resultado_final = false
    minijuego_terminado = false
    for (let j = 0; j < 5; j++) {
        palanca2 = sprites.create(assets.image`
            lever_off
            `, SpriteKind.palanca)
        palanca2.setPosition(20 + j * 30, 60)
        palancas.push(palanca2)
        num = textsprite.create("" + ("" + (j + 1)), 0, 1)
        num.setPosition(20 + j * 30, 45)
        numeros_sprites.push(num)
    }
    cursor2 = sprites.create(assets.image`
            cursor_arrow
            `, SpriteKind.cursor)
    cursor2.setPosition(palancas[0].x, 40)
    intentos_text = textsprite.create("Intentos: 3/3", 0, 1)
    intentos_text.setPosition(80, 10)
    while (intentos < 3 && !minijuego_terminado) {
        if (controller.right.isPressed() && cursor_pos < 4) {
            cursor_pos += 1
            cursor2.setPosition(palancas[cursor_pos].x, 40)
            pause(200)
        } else if (controller.left.isPressed() && cursor_pos > 0) {
            cursor_pos += 0 - 1
            cursor2.setPosition(palancas[cursor_pos].x, 40)
            pause(200)
        }
        
        if (controller.A.isPressed()) {
            estados_palancas[cursor_pos] = !estados_palancas[cursor_pos]
            if (estados_palancas[cursor_pos]) {
                palancas[cursor_pos].setImage(assets.image`
                    lever_on
                    `)
            } else {
                palancas[cursor_pos].setImage(assets.image`
                    lever_off
                    `)
            }
            
            pause(300)
        }
        
        if (controller.B.isPressed()) {
            intentos += 1
            intentos_text.setText("Intentos: " + ("" + ("" + (3 - intentos))) + "/3")
            if (estados_palancas[1] && estados_palancas[3] && !estados_palancas[0] && !estados_palancas[2] && !estados_palancas[4]) {
                game.showLongText("CORRECTO! Marcus libre!", DialogLayout.Bottom)
                resultado_final = true
                minijuego_terminado = true
            } else {
                game.showLongText("Incorrecto!", DialogLayout.Bottom)
                if (intentos >= 3) {
                    game.showLongText("Marcus murio...", DialogLayout.Bottom)
                    minijuego_terminado = true
                } else {
                    for (let k = 0; k < 5; k++) {
                        estados_palancas[k] = false
                        palancas[k].setImage(assets.image`
                            lever_off
                            `)
                    }
                }
                
            }
            
            pause(500)
        }
        
        pause(50)
    }
    cursor2.destroy()
    intentos_text.destroy()
    for (let p of palancas) {
        p.destroy()
    }
    for (let ns of numeros_sprites) {
        ns.destroy()
    }
    return resultado_final
}

let projectile : Sprite = null
let tiempo_ultimo_disparo = 0
let ultimo_ataque = 0
let intentos_text : TextSprite = null
let cursor2 : Sprite = null
let minijuego_terminado = false
let resultado_final = false
let intentos = 0
let cursor_pos = 0
let estados_palancas : boolean[] = []
let menu_armas : miniMenu.MenuSprite = null
let nueva_loc : tiles.Location = null
let nueva_y = 0
let nueva_x = 0
let distancia_repulsion = 0
let char_name2 = ""
let character_names : string[] = []
let char_menu : miniMenu.MenuSprite = null
let bg_sprite2 : Sprite = null
let tutorial_mostrado = false
let moneda22 : Sprite = null
let main_menu : miniMenu.MenuSprite = null
let floor2_coordenadas : tiles.Location[] = []
let floor1_coordenadas : tiles.Location[] = []
let cofres_coordenadas : tiles.Location[] = []
let menu_dificultad : miniMenu.MenuSprite = null
let tiempo_inicio = 0
let respuesta_correcta = 0
let menu_adivinanza : miniMenu.MenuSprite = null
let randomIndex = 0
let ultimo_enemigo = 0
let imagen_arma2 : Image = null
let tipo_arma = ""
let contador : TextSprite = null
let shurikens_esquivados = 0
let golpeado = false
let jugador_temp : Sprite = null
let ultimo_dodge = 0
let menu_tutorial : miniMenu.MenuSprite = null
let status_bar : StatusBarSprite = null
let enemy_spawn_index = 0
let enemy_coordenadas : tiles.Location[] = []
let enemic1 : Sprite = null
let ultimo_enemigo2 = 0
let arma_hud : Sprite = null
let score = 0
let item_suelo2 : Sprite = null
let menu_temps : miniMenu.MenuSprite = null
let ultima_direccion_y = 0
let prisoner_npc : Sprite = null
let npcs_coordenadas : tiles.Location[] = []
let girl_npc : Sprite = null
let escudo_tiempo_inicio = 0
let arma_equipada = ""
let bg_sprite3 : Sprite = null
let selected_character = 0
let skip_dialogo = false
let player_statusbar : StatusBarSprite = null
let escudo_activo = false
let dodge_roll = false
let npcs_dead = 0
let npcs_saved = 0
let doctor_npc : Sprite = null
let is_player_talking = false
let player_sprite : Sprite = null
let menu : miniMenu.MenuSprite = null
let menu_configuracio : miniMenu.MenuSprite = null
let cooldown_minimo_dodge = 0
let mapaJoc = false
let GAME_STATE_MENU = 0
let game_state = 0
let GAME_STATE_PLAYING = 0
let GAME_STATE_CHAR_SELECT = 0
let max_enemics = 0
let dificultad = ""
let enemigos_intervalo = 0
let velocidad_enemigo = 0
let GAME_STATE_JIGSAW_MESSAGE = 0
let GAME_STATE_CHAR_STORY = 0
let KILL_BONUS = 0
let MONEDA_VALOR = 0
let PRECIO_ESCUDO = 0
let PRECIO_PISTOLA = 0
let PRECIO_ESPADA = 0
let ultima_direccion_x = 0
let DURACION_ESCUDO = 0
let duracion_partida = 0
let moneda2 = null
let max_intentos = 0
let enemy_status = null
let char_name = ""
let tiempo_decision = 0
let bg_sprite : Sprite = null
let escudo_sprite : Sprite = null
let enemy_status2 : StatusBarSprite = null
duracion_partida = 180
DURACION_ESCUDO = 20000
ultima_direccion_x = 1
PRECIO_ESPADA = 50
PRECIO_PISTOLA = 75
PRECIO_ESCUDO = 100
MONEDA_VALOR = 10
KILL_BONUS = 50
let GAME_STATE_INTRO = -1
GAME_STATE_CHAR_STORY = 4
let GAME_STATE_NAME_INPUT = 5
GAME_STATE_JIGSAW_MESSAGE = 6
let GAME_STATE_TUTORIAL = 7
velocidad_enemigo = 55
enemigos_intervalo = 30000
dificultad = "FACIL"
max_enemics = 6
GAME_STATE_CHAR_SELECT = 1
GAME_STATE_NAME_INPUT = 2
GAME_STATE_PLAYING = 3
game_state = GAME_STATE_MENU
let player_name = "HUNTER"
let game_time = 180
let pantalla = "joc"
mapaJoc = false
let cooldown_minimo_ataque = 400
cooldown_minimo_dodge = 500
scene.setBackgroundColor(0)
show_main_menu()
game.onUpdate(function on_on_update() {
    let vx: number;
    let vy: number;
    let imagen_bala: Image;
    let offset_x: number;
    let offset_y: number;
    let espada: Sprite;
    
    mode_attack()
    update_escudo()
    if (controller.B.isPressed() && game_state == GAME_STATE_PLAYING && player_sprite) {
        if (game.runtime() - ultimo_ataque < cooldown_minimo_ataque) {
            return
        }
        
        if (arma_equipada == "pistola") {
            if (game.runtime() - tiempo_ultimo_disparo < 500) {
                return
            }
            
            tiempo_ultimo_disparo = game.runtime()
            ultimo_ataque = game.runtime()
            vx = ultima_direccion_x * 200
            vy = ultima_direccion_y * 200
            imagen_bala = null
            if (ultima_direccion_x > 0) {
                imagen_bala = assets.image`
                    bullet_right
                    `
            } else if (ultima_direccion_x < 0) {
                imagen_bala = assets.image`
                    bullet_left
                    `
            } else if (ultima_direccion_y > 0) {
                imagen_bala = assets.image`
                    bullet_down
                    `
            } else {
                imagen_bala = assets.image`
                    bullet_up
                    `
            }
            
            projectile = sprites.createProjectileFromSprite(imagen_bala, player_sprite, vx, vy)
            sprites.setDataNumber(projectile, "damage", 1)
            music.play(music.melodyPlayable(music.pewPew), music.PlaybackMode.InBackground)
        } else if (arma_equipada == "espada") {
            if (game.runtime() - tiempo_ultimo_disparo < 800) {
                return
            }
            
            tiempo_ultimo_disparo = game.runtime()
            ultimo_ataque = game.runtime()
            offset_x = 0
            offset_y = 0
            if (ultima_direccion_x > 0) {
                espada = sprites.create(assets.image`
                        sword_swing_right
                        `, SpriteKind.Projectile)
                offset_x = 16
            } else if (ultima_direccion_x < 0) {
                espada = sprites.create(assets.image`
                        sword_swing_left
                        `, SpriteKind.Projectile)
                offset_x = -16
            } else if (ultima_direccion_y > 0) {
                espada = sprites.create(assets.image`
                        sword_swing_up
                        `, SpriteKind.Projectile)
                offset_y = 16
            } else {
                espada = sprites.create(assets.image`
                        sword_swing_up
                        `, SpriteKind.Projectile)
                offset_y = -16
            }
            
            espada.setPosition(player_sprite.x + offset_x, player_sprite.y + offset_y)
            espada.lifespan = 200
            sprites.setDataNumber(espada, "damage", 2)
        } else if (arma_equipada == "escudo" && !escudo_activo) {
            activar_escudo()
        }
        
    }
    
})
forever(function on_forever() {
    
    music.play(music.stringPlayable("E B C5 A B G A F ", 120), music.PlaybackMode.LoopingInBackground)
    if (mapaJoc) {
        mapaJoc = false
        tiles.setCurrentTilemap(tilemap`
            mapa
            `)
        cargar_coordenadas_mapa()
        start_gameplay()
        if (player_sprite) {
            tiles.placeOnRandomTile(player_sprite, assets.tile`
                stage
                `)
            controller.moveSprite(player_sprite, 100, 100)
            scene.cameraFollowSprite(player_sprite)
        }
        
    }
    
    spawner_enemics()
    pause(100)
})
