namespace SpriteKind {
    export const moneda = SpriteKind.create()
    export const enemic = SpriteKind.create()
}

function inventari_armes() {
    
    let escudo = 0
    let pistola = 0
    let espada = 0
    pantalla = "inventari"
    mapaJoc = false
    inventari_obert = true
    mapa_anterior = tilemap`
        mapa
        `
    scene.centerCameraAt(80, 60)
    controller.moveSprite(player_sprite, 0, 0)
    inventari_armes2 = [miniMenu.createMenuItem("Espada " + ("" + ("" + espada)), assets.image`
                espada
                `), miniMenu.createMenuItem("Pistola " + ("" + ("" + pistola)), assets.image`
                pistola
                `), miniMenu.createMenuItem("Escudo temporal " + ("" + ("" + escudo)), assets.image`
                escudo
                `)]
    my_menu = miniMenu.createMenuFromArray(inventari_armes2)
    my_menu.setTitle("Inventari")
    my_menu.setFrame(assets.image`
        mapa_inventari
        `)
    my_menu.setPosition(80, 60)
    my_menu.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Background, 54)
    function on_button_pressed(selection: any, selectedIndex: any) {
        
        inventari_obert = false
        pantalla = "joc"
        game_state = GAME_STATE_PLAYING
        my_menu.close()
        if (mapa_anterior) {
            tiles.setCurrentTilemap(mapa_anterior)
        }
        
        tiles.placeOnRandomTile(player_sprite, sprites.dungeon.chestOpen)
        controller.moveSprite(player_sprite, 100, 100)
        scene.cameraFollowSprite(player_sprite)
    }
    
}

controller.down.onEvent(ControllerButtonEvent.Pressed, function on_down_pressed() {
    //  Crea un enemic cada 30 segons i fa que persegueixi el jugador
    if (game_state == GAME_STATE_PLAYING && player_sprite) {
        if (selected_character == 0) {
            animation.runImageAnimation(player_sprite, assets.animation`
                    jugadorvermell_bajar
                    `, 500, true)
        } else if (selected_character == 1) {
            animation.runImageAnimation(player_sprite, assets.animation`
                    jugadorkira_bajar
                    `, 500, true)
        } else if (randomIndex == 1) {
            animation.runImageAnimation(player_sprite, assets.animation`
                    jugadorrandoomlila_bajar
                    `, 500, true)
        } else if (randomIndex == 2) {
            animation.runImageAnimation(player_sprite, assets.animation`
                    jugadorrandoomrosa_bajar
                    `, 500, true)
        } else if (randomIndex == 3) {
            animation.runImageAnimation(player_sprite, assets.animation`
                    jugadorrandoomgroc_bajar
                    `, 500, true)
        } else {
            animation.runImageAnimation(player_sprite, assets.animation`
                    jugadorrandoommarro_bajar
                    `, 500, true)
        }
        
    }
    
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function on_right_pressed() {
    //  Crea un enemic cada 30 segons i fa que persegueixi el jugador
    if (game_state == GAME_STATE_PLAYING && player_sprite) {
        if (selected_character == 0) {
            animation.runImageAnimation(player_sprite, assets.animation`
                    jugadorvermell_dreta
                    `, 500, true)
        } else if (selected_character == 1) {
            animation.runImageAnimation(player_sprite, assets.animation`
                    jugadorkira_derecha
                    `, 500, true)
        } else if (randomIndex == 1) {
            animation.runImageAnimation(player_sprite, assets.animation`
                    jugadorrandoomlila_derecha
                    `, 500, true)
        } else if (randomIndex == 2) {
            animation.runImageAnimation(player_sprite, assets.animation`
                    jugadorrandoomrosa_derecha
                    `, 500, true)
        } else if (randomIndex == 3) {
            animation.runImageAnimation(player_sprite, assets.animation`
                    jugadorrandoomgroc_derecha0
                    `, 500, true)
        } else {
            animation.runImageAnimation(player_sprite, assets.animation`
                    jugadorrandoommarro_derecha
                    `, 500, true)
        }
        
    }
    
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function on_left_pressed() {
    //  Crea un enemic cada 30 segons i fa que persegueixi el jugador
    if (game_state == GAME_STATE_PLAYING && player_sprite) {
        if (selected_character == 0) {
            animation.runImageAnimation(player_sprite, assets.animation`
                    jugadorvermell_esquerra
                    `, 500, true)
        } else if (selected_character == 1) {
            animation.runImageAnimation(player_sprite, assets.animation`
                    jugadorkira_esquerra
                    `, 500, true)
        } else if (randomIndex == 1) {
            animation.runImageAnimation(player_sprite, assets.animation`
                    jugadorrandoomlila_esquerra
                    `, 500, true)
        } else if (randomIndex == 2) {
            animation.runImageAnimation(player_sprite, assets.animation`
                    jugadorrandoomrosa_esquerra
                    `, 500, true)
        } else if (randomIndex == 3) {
            animation.runImageAnimation(player_sprite, assets.animation`
                    jugadorrandoomgroc_esquerra
                    `, 500, true)
        } else {
            animation.runImageAnimation(player_sprite, assets.animation`
                    jugadorrandoommarro_esquerra0
                    `, 500, true)
        }
        
    }
    
})
info.onCountdownEnd(function on_countdown_end() {
    //  Quan s'acaba el temps: comprova si s'ha arribat a la puntuació objectiu
    if (score >= 500) {
        game.splash("VICTORIA!", "Score: " + ("" + ("" + score)))
    } else {
        game.splash("GAME OVER", "Score: " + ("" + ("" + score)))
    }
    
    game.reset()
})
scene.onOverlapTile(SpriteKind.Player, sprites.dungeon.chestClosed, function on_overlap_tile(sprite: Sprite, location: tiles.Location) {
    if (pantalla == "joc") {
        inventari_armes()
    }
    
})
function start_gameplay() {
    
    //  Inicialitza el joc: crea el jugador, reinicia score i temporitzador
    game_state = GAME_STATE_PLAYING
    score = 0
    game_time = 180
    sprites.destroyAllSpritesOfKind(SpriteKind.Player)
    if (selected_character == 0) {
        player_sprite = sprites.create(assets.image`
                jugador_vermell
                `, SpriteKind.Player)
    } else if (selected_character == 1) {
        player_sprite = sprites.create(assets.image`
                jugador_kira
                `, SpriteKind.Player)
    } else {
        player_sprite = crear_jugador_random()
    }
    
}

function crear_jugador_random(): Sprite {
    
    randomIndex = randint(1, 4)
    if (randomIndex == 1) {
        return sprites.create(assets.image`
                jugador_randoom1
                `, SpriteKind.Player)
    } else if (randomIndex == 2) {
        return sprites.create(assets.image`
                jugador_randoom2
                `, SpriteKind.Player)
    } else if (randomIndex == 3) {
        return sprites.create(assets.image`
                jugador_randoom3
                `, SpriteKind.Player)
    } else {
        return sprites.create(assets.image`
                jugador_randoom4
                `, SpriteKind.Player)
    }
    
}

controller.up.onEvent(ControllerButtonEvent.Pressed, function on_up_pressed() {
    //  Crea un enemic cada 30 segons i fa que persegueixi el jugador
    if (game_state == GAME_STATE_PLAYING && player_sprite) {
        if (selected_character == 0) {
            animation.runImageAnimation(player_sprite, assets.animation`
                    jugadorvermell_subir0
                    `, 500, true)
        } else if (selected_character == 1) {
            animation.runImageAnimation(player_sprite, assets.animation`
                    jugadorkira_subir
                    `, 500, true)
        } else if (randomIndex == 1) {
            animation.runImageAnimation(player_sprite, assets.animation`
                    jugadorrandoom1_subir
                    `, 500, true)
        } else if (randomIndex == 2) {
            animation.runImageAnimation(player_sprite, assets.animation`
                    jugadorrandoomrosa_subir
                    `, 500, true)
        } else if (randomIndex == 3) {
            animation.runImageAnimation(player_sprite, assets.animation`
                    jugadorrandoomgroc_subir
                    `, 500, true)
        } else {
            animation.runImageAnimation(player_sprite, assets.animation`
                    jugadorrandoommarro_subir
                    `, 500, true)
        }
        
    }
    
})
function show_main_menu() {
    
    //  Mostra el menú principal i gestiona la selecció amb el botó A
    game_state = GAME_STATE_MENU
    main_menu = miniMenu.createMenu(miniMenu.createMenuItem("HISTORIA"), miniMenu.createMenuItem("VERSUS"), miniMenu.createMenuItem("CREDITOS"))
    main_menu.setPosition(80, 60)
    main_menu.setMenuStyleProperty(miniMenu.MenuStyleProperty.Width, 80)
    main_menu.setMenuStyleProperty(miniMenu.MenuStyleProperty.Height, 50)
    main_menu.setStyleProperty(miniMenu.StyleKind.Default, miniMenu.StyleProperty.Background, 15)
    main_menu.setStyleProperty(miniMenu.StyleKind.Default, miniMenu.StyleProperty.Foreground, 1)
    main_menu.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Background, 8)
    main_menu.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Foreground, 1)
    main_menu.onButtonPressed(controller.A, function on_button_pressed2(selection2: any, selectedIndex2: any) {
        //  Executa l'acció segons l'opció triada al menú principal
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

sprites.onOverlap(SpriteKind.Player, SpriteKind.moneda, function on_on_overlap(player22: Sprite, coin: Sprite) {
    
    //  Quan el jugador toca una moneda: suma puntuació, so i destrueix la moneda
    score += 1
    info.changeScoreBy(1)
    music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
    sprites.destroy(coin, effects.spray, 200)
})
function show_character_select() {
    
    //  Mostra el menú per seleccionar personatge i activa l'inici de partida
    game_state = GAME_STATE_CHAR_SELECT
    sprites.destroyAllSpritesOfKind(SpriteKind.Player)
    char_menu = miniMenu.createMenu(miniMenu.createMenuItem("ANDER", assets.image`
            jugador_vermell
            `), miniMenu.createMenuItem("KIRA", assets.image`
            jugador_kira
            `), miniMenu.createMenuItem("RANDOM", assets.image`
            jugador_randoom0
            `))
    char_menu.setPosition(80, 64)
    char_menu.setStyleProperty(miniMenu.StyleKind.Default, miniMenu.StyleProperty.Background, 15)
    char_menu.setStyleProperty(miniMenu.StyleKind.Default, miniMenu.StyleProperty.Foreground, 1)
    char_menu.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Background, 8)
    char_menu.setStyleProperty(miniMenu.StyleKind.Selected, miniMenu.StyleProperty.Foreground, 1)
    char_menu.onButtonPressed(controller.A, function on_button_pressed3(selection22: any, selectedIndex22: number) {
        
        //  Desa el personatge seleccionat i marca que s'ha de començar el joc
        selected_character = selectedIndex22
        char_menu.close()
        sprites.destroyAllSpritesOfKind(SpriteKind.Player)
        mapaJoc = true
    })
}

sprites.onOverlap(SpriteKind.Player, SpriteKind.enemic, function on_on_overlap2(player2: Sprite, enemy: Sprite) {
    //  Quan l'enemic toca el jugador: game over
    game.gameOver(false)
})
let enemic1 : Sprite = null
let moneda2 : Sprite = null
let char_menu : miniMenu.MenuSprite = null
let main_menu : miniMenu.MenuSprite = null
let score = 0
let randomIndex = 0
let selected_character = 0
let inventari_armes2 : miniMenu.MenuItem[] = []
let mapaJoc = false
let game_time = 0
let GAME_STATE_MENU = 0
let GAME_STATE_CHAR_SELECT = 0
let randomIndex2 = 0
let GAME_STATE_PLAYING = 0
let game_state = 0
let pantalla = ""
let inventari_obert = false
let mapa_anterior : tiles.TileMapData = null
let player_sprite : Sprite = null
let my_menu : miniMenu.MenuSprite = null
GAME_STATE_CHAR_SELECT = 1
let GAME_STATE_NAME_INPUT = 2
GAME_STATE_PLAYING = 3
game_state = GAME_STATE_MENU
let player_name = "HUNTER"
game_time = 360
pantalla = "joc"
mapaJoc = false
scene.setBackgroundColor(15)
effects.starField.startScreenEffect()
game.splash("CYBER-NEON", "VIRUS HUNT")
show_main_menu()
game.onUpdateInterval(5000, function on_update_interval() {
    
    //  Crea una moneda cada 5 segons mentre s'està jugant
    if (game_state == GAME_STATE_PLAYING) {
        moneda2 = sprites.create(assets.image`
            moneda
            `, SpriteKind.moneda)
        tiles.placeOnRandomTile(moneda2, sprites.dungeon.darkGroundCenter)
    }
    
})
forever(function on_forever() {
    
    //  Quan s'ha triat personatge, inicia la partida i col·loca el jugador al mapa
    if (mapaJoc == true) {
        mapaJoc = false
        start_gameplay()
        tiles.setCurrentTilemap(tilemap`
            mapa
            `)
        tiles.placeOnRandomTile(player_sprite, assets.tile`
            stage
            `)
        controller.moveSprite(player_sprite, 100, 100)
        scene.cameraFollowSprite(player_sprite)
    }
    
    pause(100)
})
game.onUpdateInterval(30000, function on_update_interval2() {
    
    //  Crea un enemic cada 30 segons i fa que persegueixi el jugador
    if (game_state == GAME_STATE_PLAYING && player_sprite) {
        sprites.destroyAllSpritesOfKind(SpriteKind.enemic)
        enemic1 = sprites.create(assets.image`
            enemic1
            `, SpriteKind.enemic)
        tiles.placeOnRandomTile(enemic1, sprites.dungeon.collectibleBlueCrystal)
        enemic1.follow(player_sprite, 60)
        animation.runImageAnimation(enemic1, assets.animation`
                enimacio_enemic
                `, 200, true)
    }
    
})
