const Game = require("../models/Game"); 

const getGames = async (req, res) => {
  try {
    const games = await Game.find();
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los juegos", error: error.message });
  }
};

// Pega esta nueva función en tu gameController.js

const getGameById = async (req, res) => {
  try {
    // Busca en la base de datos un juego que coincida con el ID de la URL (req.params.id)
    const game = await Game.findById(req.params.id);
    
    // Si no se encuentra ningún juego, devuelve un error 404
    if (!game) {
      return res.status(404).json({ success: false, message: "Juego no encontrado" });
    }
    
    // Si se encuentra, devuelve el juego con un estado 200 OK
    res.status(200).json({ success: true, data: game });
  } catch (error) {
    // Si hay un error en el servidor (ej. el ID tiene un formato incorrecto)
    console.error("Error al obtener juego por ID:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
};

const createGame = async (req, res) => {
  try {
    const newGame = new Game(req.body);
    await newGame.save();
    res.status(201).json({ message: "Juego agregado", newGame });
  } catch (error) {
    res.status(400).json({ message: "Error al agregar el juego", error: error.message });
  }
};

const updateGame = async (req, res) => {
  try {
    const updatedGame = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    if (!updatedGame) {
      return res.status(404).json({ message: "Juego no encontrado" });
    }
    
    res.json({ message: "Juego actualizado", updatedGame });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el juego", error: error.message });
  }
};

const deleteGame = async (req, res) => {
  try {
    const deletedGame = await Game.findByIdAndDelete(req.params.id);
    if (!deletedGame) {
      return res.status(404).json({ message: "Juego no encontrado" });
    }
    res.status(200).json({ message: "Juego eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el juego", error: error.message });
  }
};


module.exports = {
  getGames,
  createGame, 
  updateGame,
  deleteGame,
  getGameById
};