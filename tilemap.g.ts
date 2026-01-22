// Código generado automáticamente. No editar.
namespace myTiles {
    //% fixedInstance jres blockIdentity=images._tile
    export const transparency16 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile11 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile12 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile8 = image.ofBuffer(hex``);

    helpers._registerFactory("tilemap", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "mapa0":
            case "nivel2":return tiles.createTilemap(hex`1000100002020202020202020202020202020202020000000000000200000000000000020100020000020002000000020000000202000202000202020002000200020002020000000002000200020000000200020200020202020000000200000002000202000000000000000002060200020002020000020202020000020202000200020200000002070000000200020002000202000202020002020202000000020002020000000000020000000000000200020200000202020402020202020002000202000000000000000000000000020002020002020202020202020202020000020200020000000000000000000000000302020202020202020202020202020205`, img`
2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
2 . . . . . . 2 . . . . . . . 2 
. . 2 . . 2 . 2 . . . 2 . . . 2 
2 . 2 2 . 2 2 2 . 2 . 2 . 2 . 2 
2 . . . . 2 . 2 . 2 . . . 2 . 2 
2 . 2 2 2 2 . . . 2 . . . 2 . 2 
2 . . . . . . . . 2 . 2 . 2 . 2 
2 . . 2 2 2 2 . . 2 2 2 . 2 . 2 
2 . . . 2 . . . . 2 . 2 . 2 . 2 
2 . 2 2 2 . 2 2 2 2 . . . 2 . 2 
2 . . . . . 2 . . . . . . 2 . 2 
2 . . 2 2 2 . 2 2 2 2 2 . 2 . 2 
2 . . . . . . . . . . . . 2 . 2 
2 . 2 2 2 2 2 2 2 2 2 2 2 . . 2 
2 . 2 . . . . . . . . . . . . . 
2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 . 
`, [myTiles.transparency16,myTiles.tile11,myTiles.tile12,myTiles.tile8,sprites.dungeon.chestClosed,sprites.castle.tileDarkGrass2,sprites.dungeon.chestOpen,myTiles.transparency16], TileScale.Sixteen);
        }
        return null;
    })

    helpers._registerFactory("tile", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "transparency16":return transparency16;
            case "stage":
            case "tile11":return tile11;
            case "wall":
            case "tile12":return tile12;
            case "exit":
            case "tile8":return tile8;
        }
        return null;
    })

}
// Código generado automáticamente. No editar.
