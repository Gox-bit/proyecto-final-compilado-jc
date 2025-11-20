// src/utils/gameImages.js

export const GAME_COVERS = {
    "Crash Bandicoot": "https://image.api.playstation.com/cdn/UP0002/CUSA07402_00/03ZtrPdjasIxzi8QrzOb2zCIHLMydFbh.png",
    "Fortnite": "https://i.ytimg.com/vi/adGdyCdvKz4/maxresdefault.jpg",
    "Need For Speed Heat": "https://i.ytimg.com/vi/9ewiJJe_nYI/maxresdefault.jpg",
    "Red Dead Redemption 2": "https://image.api.playstation.com/cdn/UP1004/CUSA03041_00/Hpl5MtwQgOVF9vJqlfui6SDB5Jl4oBSq.png",
    "Naruto Shippuden Ultimate Ninja Storm 4": "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/349040/capsule_616x353.jpg?t=1703080866",
    "Hogwarts Legacy": "https://www.hogwartslegacy.com/images/share.jpg"
};

export const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=800";

export const getGameImageByTitle = (title, backendImage) => {
    if (backendImage) return backendImage;
    if (title && GAME_COVERS[title]) return GAME_COVERS[title];
    return DEFAULT_IMAGE;
};