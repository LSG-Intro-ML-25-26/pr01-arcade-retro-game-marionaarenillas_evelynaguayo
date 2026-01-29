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
}
// ========== FUNCIONES DEL JUEGO ORIGINAL ==========
function configuracion_partida () {
    menu_configuracio = miniMenu.createMenu(
    miniMenu.createMenuItem("Tiempo Partida"),
    miniMenu.createMenuItem("Dificultad"),
    miniMenu.createMenuItem("Volver")
    )
    menu = menu_configuracio
    estructura_menus()
    menu_configuracio.onButtonPressed(controller.A, function (selection, selectedIndex) {
        menu_configuracio.close()
        if (selectedIndex == 0) {
            menu_temps2()
        } else if (selectedIndex == 1) {
            menu_dificultad2()
        } else {
            show_main_menu()
        }
    })
}
// ========== SISTEMA DE ATAQUE DE ENEMIGOS ==========
function mode_attack () {
    for (let un_enemigo of sprites.allOfKind(SpriteKind.enemic)) {
        un_enemigo.follow(player_sprite, velocidad_enemigo)
    }
}
// ========== COLISIÓN PROYECTIL ENEMIGO - JUGADOR ==========
sprites.onOverlap(SpriteKind.Player, SpriteKind.ENEMIE_PROJECTILE, function (sprite_player, sprite_proj) {
    sprite_proj.destroy()
    if (dodge_roll || escudo_activo) {
    	
    }
    info.changeLifeBy(-1)
    scene.cameraShake(2, 100)
    music.play(music.melodyPlayable(music.thump), music.PlaybackMode.InBackground)
})
function show_character_story () {
    game_state = GAME_STATE_CHAR_STORY
    scene.setBackgroundColor(0)
    if (selected_character == 0) {
        game.splash("ANDER", "Vi a un hombre morir... y no hice nada.")
    } else if (selected_character == 1) {
        game.splash("KIRA", "Manipulé y destruí vidas sin remordimiento.")
    } else {
        game.splash("RANDOM", "Siempre fui indiferente al sufrimiento.")
    }
    pause(1000)
    game.showLongText("Y entonces... todo se volvió negro.", DialogLayout.Bottom)
    pause(1000)
    show_jigsaw_message()
}
// ========== INVENTARIO MEJORADO CON ARMAS ==========
function inventari_armes () {
    tiene_espada = true
    tiene_pistola = true
    tiene_escudo = true
    pantalla = "inventari"
    mapaJoc = false
    inventari_obert = true
    mapa_anterior = tilemap`mapa`
    scene.centerCameraAt(80, 60)
    controller.moveSprite(player_sprite, 0, 0)
    inventari_armes2 = [miniMenu.createMenuItem("Espada (Cuerpo a cuerpo)", assets.image`espada`), miniMenu.createMenuItem("Pistola (Disparo)", assets.image`pistola`), miniMenu.createMenuItem("Escudo (Defensa temporal)", assets.image`escudo`)]
    my_menu = miniMenu.createMenuFromArray(inventari_armes2)
    my_menu.setTitle("ARMAS DESBLOQUEADAS")
    my_menu.setFrame(assets.image`mapa_inventari`)
    my_menu.setPosition(80, 60)
    my_menu.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Background, 54)
    my_menu.onButtonPressed(controller.A, function (selection2, selectedIndex2) {
        inventari_obert = false
        pantalla = "joc"
        game_state = GAME_STATE_PLAYING
        if (selectedIndex2 == 0) {
            arma_equipada = "espada"
            game.splash("ESPADA EQUIPADA", "Presiona B cerca del enemigo")
        } else if (selectedIndex2 == 1) {
            arma_equipada = "pistola"
            game.splash("PISTOLA EQUIPADA", "Presiona B para disparar")
        } else if (selectedIndex2 == 2) {
            arma_equipada = "escudo"
            activar_escudo()
        }
        my_menu.close()
        tiles.setCurrentTilemap(mapa_anterior)
        scene.cameraFollowSprite(player_sprite)
        controller.moveSprite(player_sprite, 100, 100)
    })
}
// ========== SISTEMA DE ESCUDO ==========
function activar_escudo () {
    escudo_activo = true
    game.splash("ESCUDO ACTIVADO", "Inmune por 5 segundos")
    effects.starField.startScreenEffect()
    pause(5000)
    escudo_activo = false
    game.splash("ESCUDO DESACTIVADO", "")
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.NPC_Girl, function (sprite, otherSprite) {
    if (is_player_talking || girl_npc.kind() == SpriteKind.Complete || girl_npc.kind() == SpriteKind.Dead) {
    	
    }
    if (controller.A.isPressed()) {
        is_player_talking = true
        game.splash("NIÑA", "Me envenenaron... ¿Me salvas?")
        respuesta2 = game.ask("¿Buscar antídoto?", "A=SÍ, B=NO")
        if (respuesta2) {
            game.splash("NIÑA", "¡Gracias por salvarme!")
            girl_npc.setKind(SpriteKind.Complete)
            info.changeScoreBy(200)
            npcs_saved += 1
        } else {
            game.splash("...", "*La niña muere*")
            girl_npc.destroy()
            npcs_dead += 1
            info.changeScoreBy(-100)
        }
        is_player_talking = false
    }
})
function spawn_npcs_in_map () {
    doctor_npc = sprites.create(assets.image`jugador_vermell`, SpriteKind.NPC_Doctor)
    tiles.placeOnRandomTile(doctor_npc, assets.tile`transparency16`)
    girl_npc = sprites.create(assets.image`jugador_kira`, SpriteKind.NPC_Girl)
    tiles.placeOnRandomTile(girl_npc, assets.tile`transparency16`)
    prisoner_npc = sprites.create(assets.image`jugador_randoom0`, SpriteKind.NPC_Prisoner)
    tiles.placeOnRandomTile(prisoner_npc, assets.tile`transparency16`)
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.NPC_Doctor, function (sprite, otherSprite) {
    if (is_player_talking || doctor_npc.kind() == SpriteKind.Complete || doctor_npc.kind() == SpriteKind.Dead) {
    	
    }
    if (controller.A.isPressed()) {
        is_player_talking = true
        game.splash("DOCTOR", "¡Bomba en el pecho! ¿Me ayudas?")
        respuesta = game.ask("¿Ayudarlo?", "A=SÍ, B=NO")
        if (respuesta) {
            game.splash("DOCTOR", "¡Gracias! ¡Salvaste mi vida!")
            doctor_npc.setKind(SpriteKind.Complete)
            info.changeScoreBy(150)
            npcs_saved += 1
        } else {
            game.splash("", "*EXPLOSIÓN*")
            doctor_npc.destroy()
            npcs_dead += 1
            info.changeScoreBy(-50)
        }
        is_player_talking = false
    }
})
// ========== ANIMACIONES (SIMPLIFICADAS) ==========
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (game_state == GAME_STATE_PLAYING && player_sprite) {
        if (selected_character == 0) {
            animation.runImageAnimation(
            player_sprite,
            assets.animation`jugadorvermell_bajar`,
            500,
            true
            )
        } else if (selected_character == 1) {
            animation.runImageAnimation(
            player_sprite,
            assets.animation`jugadorkira_bajar`,
            500,
            true
            )
        }
    }
})
function menu_temps2 () {
    menu_temps = miniMenu.createMenu(
    miniMenu.createMenuItem("3 minutos"),
    miniMenu.createMenuItem("5 minutos"),
    miniMenu.createMenuItem("7 minutos"),
    miniMenu.createMenuItem("Volver")
    )
    menu = menu_temps
    estructura_menus()
    menu_temps.onButtonPressed(controller.A, function (selection3, selectedIndex3) {
        menu_temps.close()
        if (selectedIndex3 == 0) {
            duracion_partida = 180
            game.splash("Tiempo seleccionado: 3 minutos")
            configuracion_partida()
        } else if (selectedIndex3 == 1) {
            duracion_partida = 300
            game.splash("Tiempo seleccionado: 5 minutos")
            configuracion_partida()
        } else if (selectedIndex3 == 2) {
            duracion_partida = 420
            game.splash("Tiempo seleccionado: 7 minutos")
            configuracion_partida()
        } else {
            configuracion_partida()
        }
    })
}
function spawner_enemics () {
    if (game_state != GAME_STATE_PLAYING || !(player_sprite)) {
        return
    }
    if (sprites.allOfKind(SpriteKind.enemic).length >= max_enemics) {
        return
    }
    if (game.runtime() - ultimo_enemigo2 < enemigos_intervalo) {
        return
    }
    ultimo_enemigo2 = game.runtime()
    enemic1 = sprites.create(assets.image`enemic1`, SpriteKind.enemic)
    tiles.placeOnRandomTile(enemic1, sprites.dungeon.collectibleBlueCrystal)
    enemic1.follow(player_sprite, velocidad_enemigo)
}
// ========== INTRO SIMPLIFICADA DE JIGSAW ==========
function show_saw_intro () {
    scene.setBackgroundColor(0)
    game.showLongText("Hola... Quiero jugar un juego.", DialogLayout.Center)
    pause(2000)
    game.showLongText("Has ignorado el sufrimiento ajeno.", DialogLayout.Center)
    pause(2000)
    game.showLongText("Ahora deberás demostrar que valoras la vida.", DialogLayout.Center)
    pause(2000)
    game.showLongText("Tienes 180 segundos.", DialogLayout.Center)
    pause(2000)
    game.showLongText("Vive o muere. Haz tu elección.", DialogLayout.Center)
    pause(2000)
    scene.setBackgroundColor(2)
    game.splash("LAS PRUEBAS DE", "JIGSAW")
    pause(1000)
}
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (game_state == GAME_STATE_PLAYING && player_sprite) {
        if (selected_character == 0) {
            animation.runImageAnimation(
            player_sprite,
            assets.animation`jugadorvermell_dreta`,
            500,
            true
            )
        } else if (selected_character == 1) {
            animation.runImageAnimation(
            player_sprite,
            assets.animation`jugadorkira_derecha`,
            500,
            true
            )
        }
    }
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (game_state == GAME_STATE_PLAYING && player_sprite) {
        if (selected_character == 0) {
            animation.runImageAnimation(
            player_sprite,
            assets.animation`jugadorvermell_esquerra`,
            500,
            true
            )
        } else if (selected_character == 1) {
            animation.runImageAnimation(
            player_sprite,
            assets.animation`jugadorkira_esquerra`,
            500,
            true
            )
        }
    }
})
// ========== DODGE ROLL ==========
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (game_state != GAME_STATE_PLAYING) {
    	
    }
    dodge_roll = true
    scene.cameraShake(2, 200)
    pause(500)
    dodge_roll = false
})
info.onCountdownEnd(function () {
    scene.setBackgroundColor(0)
    if (score >= 500 && npcs_dead == 0) {
        game.splash("JIGSAW", "Impresionante. Eres libre.")
        game.splash("FINAL PERFECTO", "Score: " + ("" + score))
    } else if (score >= 300) {
        game.splash("JIGSAW", "Sobreviviste... pero a qué costo.")
        game.splash("FINAL BUENO", "Score: " + ("" + score))
    } else {
        game.splash("JIGSAW", "Fallaste.")
        game.splash("GAME OVER", "Score: " + ("" + score))
    }
    game.reset()
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.NPC_Prisoner, function (sprite, otherSprite) {
    if (is_player_talking || prisoner_npc.kind() == SpriteKind.Complete || prisoner_npc.kind() == SpriteKind.Dead) {
    	
    }
    if (controller.A.isPressed()) {
        is_player_talking = true
        game.splash("PRISIONERO", "Cadenas apretando... ¿Ayuda?")
        respuesta3 = game.ask("¿Liberarlo?", "A=SÍ, B=NO")
        if (respuesta3) {
            game.splash("PRISIONERO", "¡Libre! ¡Gracias!")
            prisoner_npc.setKind(SpriteKind.Complete)
            info.changeScoreBy(150)
            npcs_saved += 1
        } else {
            game.splash("...", "*Aplastado*")
            prisoner_npc.destroy()
            npcs_dead += 1
            info.changeScoreBy(-50)
        }
        is_player_talking = false
    }
})
scene.onOverlapTile(SpriteKind.Player, sprites.dungeon.chestClosed, function (sprite, location) {
    if (pantalla == "joc") {
        inventari_armes()
    }
})
function start_gameplay () {
    ultimo_enemigo = game.runtime()
    info.startCountdown(duracion_partida)
    game_state = GAME_STATE_PLAYING
    score = 0
    game_time = 180
    sprites.destroyAllSpritesOfKind(SpriteKind.Player)
    info.setLife(5)
    if (selected_character == 0) {
        player_sprite = sprites.create(assets.image`jugador_vermell`, SpriteKind.Player)
    } else if (selected_character == 1) {
        player_sprite = sprites.create(assets.image`jugador_kira`, SpriteKind.Player)
    } else {
        player_sprite = crear_jugador_random()
    }
    spawn_npcs_in_map()
}
function crear_jugador_random () {
    randomIndex = randint(1, 4)
    if (randomIndex == 1) {
        return sprites.create(assets.image`jugador_randoom1`, SpriteKind.Player)
    } else if (randomIndex == 2) {
        return sprites.create(assets.image`jugador_randoom2`, SpriteKind.Player)
    } else if (randomIndex == 3) {
        return sprites.create(assets.image`jugador_randoom3`, SpriteKind.Player)
    } else {
        return sprites.create(assets.image`jugador_randoom4`, SpriteKind.Player)
    }
}
function menu_dificultad2 () {
    menu_dificultad = miniMenu.createMenu(
    miniMenu.createMenuItem("Fácil"),
    miniMenu.createMenuItem("Difícil"),
    miniMenu.createMenuItem("Volver")
    )
    menu = menu_dificultad
    estructura_menus()
    menu_dificultad.onButtonPressed(controller.A, function (selection4, selectedIndex4) {
        menu_dificultad.close()
        if (selectedIndex4 == 0) {
            dificultad = "FACIL"
            enemigos_intervalo = 30000
            velocidad_enemigo = 55
            max_enemics = 6
            game.showLongText("MODO FÁCIL: Enemigos cada 30s, velocidad baja, máximo 6 enemigos", DialogLayout.Bottom)
            configuracion_partida()
        } else if (selectedIndex4 == 1) {
            dificultad = "DIFICIL"
            enemigos_intervalo = 15000
            velocidad_enemigo = 85
            max_enemics = 10
            game.showLongText("MODO DIFÍCIL: Enemigos cada 15s, velocidad alta, máximo 10 enemigos", DialogLayout.Bottom)
            configuracion_partida()
        } else if (selectedIndex4 == 2) {
            configuracion_partida()
        }
    })
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (game_state == GAME_STATE_PLAYING && player_sprite) {
        if (selected_character == 0) {
            animation.runImageAnimation(
            player_sprite,
            assets.animation`jugadorvermell_subir0`,
            500,
            true
            )
        } else if (selected_character == 1) {
            animation.runImageAnimation(
            player_sprite,
            assets.animation`jugadorkira_subir`,
            500,
            true
            )
        }
    }
})
function show_main_menu () {
    let GAME_STATE_MENU = 0
    game_state = GAME_STATE_MENU
    scene.setBackgroundColor(0)
    main_menu = miniMenu.createMenu(
    miniMenu.createMenuItem("HISTORIA"),
    miniMenu.createMenuItem("CONFIGURACIÓN"),
    miniMenu.createMenuItem("VERSUS"),
    miniMenu.createMenuItem("CREDITOS")
    )
    menu = main_menu
    estructura_menus()
    main_menu.setStyleProperty(miniMenu.StyleKind.Default, miniMenu.StyleProperty.Background, 2)
    main_menu.setStyleProperty(miniMenu.StyleKind.Default, miniMenu.StyleProperty.Foreground, 0)
    main_menu.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Background, 15)
    main_menu.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Foreground, 2)
    main_menu.onButtonPressed(controller.A, function (selection22, selectedIndex22) {
        main_menu.close()
        if (selectedIndex22 == 0) {
            show_character_select()
        } else if (selectedIndex22 == 1) {
            game.splash("CONFIGURACIÓN")
            configuracion_partida()
        } else if (selectedIndex22 == 2) {
            game.splash("VERSUS", "Proximamente!")
            show_main_menu()
        } else if (selectedIndex22 == 3) {
            game.splash("LAS PRUEBAS DE JIGSAW", "Creado por New")
            show_main_menu()
        }
    })
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.moneda, function (player22, coin) {
    score += 1
    info.changeScoreBy(1)
    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
    sprites.destroy(coin, effects.spray, 200)
})
function show_character_select () {
    game_state = GAME_STATE_CHAR_SELECT
    sprites.destroyAllSpritesOfKind(SpriteKind.Player)
    char_menu = miniMenu.createMenu(
    miniMenu.createMenuItem("ANDER - El Cobarde", assets.image`jugador_vermell`),
    miniMenu.createMenuItem("KIRA - La Manipuladora", assets.image`jugador_kira`),
    miniMenu.createMenuItem("RANDOM - El Indiferente", assets.image`jugador_randoom0`)
    )
    char_menu.setPosition(80, 64)
    char_menu.setStyleProperty(miniMenu.StyleKind.Default, miniMenu.StyleProperty.Background, 2)
    char_menu.setStyleProperty(miniMenu.StyleKind.Default, miniMenu.StyleProperty.Foreground, 0)
    char_menu.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Background, 15)
    char_menu.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Foreground, 2)
    char_menu.onButtonPressed(controller.A, function (selection222, selectedIndex222) {
        selected_character = selectedIndex222
        char_menu.close()
        sprites.destroyAllSpritesOfKind(SpriteKind.Player)
        show_character_story()
    })
}
function show_jigsaw_message () {
    game_state = GAME_STATE_JIGSAW_MESSAGE
    scene.setBackgroundColor(0)
    character_names = ["Ander", "Kira", "Random"]
    char_name = character_names[selected_character]
    game.splash("JIGSAW", "Hola, " + char_name + ".")
    game.splash("JIGSAW", "Tienes 180 segundos para redimirte.")
    game.splash("JIGSAW", "Salva a los inocentes... y sobrevive.")
    pause(1000)
    game.showLongText("Vive o muere. Haz tu elección.", DialogLayout.Center)
    pause(1000)
    mapaJoc = true
}
// ========== COLISIÓN ENEMIGO - JUGADOR (DAÑO) ==========
sprites.onOverlap(SpriteKind.Player, SpriteKind.enemic, function (player2, enemy) {
    if (dodge_roll || escudo_activo) {
    	
    }
    info.changeLifeBy(-1)
    scene.cameraShake(4, 500)
    distancia_repulsion = 10
    if (player2.x > enemy.x) {
        player2.x += distancia_repulsion
    } else {
    	
    }
})
function estructura_menus () {
    main_menu.setPosition(80, 60)
    menu.setMenuStyleProperty(miniMenu.MenuStyleProperty.Width, 120)
    menu.setMenuStyleProperty(miniMenu.MenuStyleProperty.Height, 60)
    menu.setStyleProperty(miniMenu.StyleKind.Default, miniMenu.StyleProperty.Background, 15)
    menu.setStyleProperty(miniMenu.StyleKind.Default, miniMenu.StyleProperty.Foreground, 1)
    menu.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Background, 8)
    menu.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Foreground, 1)
}
// ========== COLISIÓN PROYECTIL JUGADOR - ENEMIGO ==========
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.enemic, function (sprite_proj, enemigo_sprite) {
    sprite_proj.destroy()
    enemigo_sprite.setVelocity((0 - enemigo_sprite.vx) * 2, (0 - enemigo_sprite.vy) * 2)
    if (randint(0, 100) < 30) {
        sprites.destroy(enemigo_sprite, effects.disintegrate, 500)
        info.changeScoreBy(50)
    }
})
let moneda2: Sprite = null
let projectile: Sprite = null
let vy = 0
let vx = 0
let tiempo_ultimo_disparo = 0
let cooldown = 0
let velocidad = 0
let daño = 0
let distancia_repulsion = 0
let char_name = ""
let character_names: string[] = []
let char_menu: miniMenu.MenuSprite = null
let main_menu: miniMenu.MenuSprite = null
let menu_dificultad: miniMenu.MenuSprite = null
let randomIndex = 0
let ultimo_enemigo = 0
let respuesta3 = false
let score = 0
let enemic1: Sprite = null
let ultimo_enemigo2 = 0
let menu_temps: miniMenu.MenuSprite = null
let respuesta = false
let prisoner_npc: Sprite = null
let doctor_npc: Sprite = null
let npcs_dead = 0
let npcs_saved = 0
let respuesta2 = false
let girl_npc: Sprite = null
let is_player_talking = false
let arma_equipada = ""
let my_menu: miniMenu.MenuSprite = null
let inventari_armes2: miniMenu.MenuItem[] = []
let mapa_anterior: tiles.TileMapData = null
let inventari_obert = false
let tiene_escudo = false
let tiene_pistola = false
let tiene_espada = false
let selected_character = 0
let escudo_activo = false
let dodge_roll = false
let player_sprite: Sprite = null
let menu: miniMenu.MenuSprite = null
let menu_configuracio: miniMenu.MenuSprite = null
let mapaJoc = false
let pantalla = ""
let game_time = 0
let game_state = 0
let GAME_STATE_PLAYING = 0
let GAME_STATE_CHAR_SELECT = 0
let max_enemics = 0
let dificultad = ""
let enemigos_intervalo = 0
let velocidad_enemigo = 0
let GAME_STATE_JIGSAW_MESSAGE = 0
let GAME_STATE_CHAR_STORY = 0
let duracion_partida = 0
let jigsaw_npc = null
let randomIndex2 = 0
duracion_partida = 180
// Estados adicionales
let GAME_STATE_INTRO = -1
GAME_STATE_CHAR_STORY = 4
let GAME_STATE_NAME_INPUT = 5
GAME_STATE_JIGSAW_MESSAGE = 6
velocidad_enemigo = 55
enemigos_intervalo = 30000
dificultad = "FACIL"
max_enemics = 6
GAME_STATE_CHAR_SELECT = 1
GAME_STATE_NAME_INPUT = 2
GAME_STATE_PLAYING = 3
game_state = GAME_STATE_INTRO
let player_name = "HUNTER"
game_time = 180
pantalla = "joc"
mapaJoc = false
// ========== INICIALIZACIÓN ==========
scene.setBackgroundColor(0)
show_saw_intro()
show_main_menu()
// ========== SISTEMA DE DISPARO (CORREGIDO) ==========
// ========== SISTEMA DE DISPARO (SIMPLIFICADO Y FUNCIONAL) ==========
game.onUpdate(function () {
    mode_attack()
    if (controller.B.isPressed() && game_state == GAME_STATE_PLAYING) {
        daño = 1
        velocidad = 200
        cooldown = 500
        if (arma_equipada == "espada") {
            daño = 2
            velocidad = 0
            cooldown = 800
        } else if (arma_equipada == "pistola") {
            daño = 1
            velocidad = 200
            cooldown = 500
        } else if (arma_equipada == "escudo") {
        	
        }
        // El escudo no dispara
        if (velocidad == 0) {
        	
        }
        if (game.runtime() - tiempo_ultimo_disparo < cooldown) {
        	
        }
        tiempo_ultimo_disparo = game.runtime()
        vx = velocidad
        vy = 0
        projectile = sprites.createProjectileFromSprite(assets.image`pistola`, player_sprite, vx, vy)
        sprites.setDataNumber(projectile, "damage", daño)
        music.play(music.melodyPlayable(music.pewPew), music.PlaybackMode.InBackground)
    }
})
game.onUpdateInterval(5000, function () {
    if (game_state == GAME_STATE_PLAYING) {
        moneda2 = sprites.create(assets.image`moneda`, SpriteKind.moneda)
        tiles.placeOnRandomTile(moneda2, sprites.dungeon.darkGroundCenter)
    }
})
forever(function () {
    if (mapaJoc == true) {
        mapaJoc = false
        start_gameplay()
        tiles.setCurrentTilemap(tilemap`mapa`)
        tiles.placeOnRandomTile(player_sprite, assets.tile`stage`)
        controller.moveSprite(player_sprite, 100, 100)
        scene.cameraFollowSprite(player_sprite)
    }
    spawner_enemics()
    pause(100)
})
