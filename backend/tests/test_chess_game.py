"""
Tests for chess game logic
"""
import pytest
from src.chess_game import ChessGame, Position


class TestChessGame:
    """Test cases for ChessGame class"""
    
    def test_game_initialization(self):
        """Test that a new game initializes correctly"""
        game = ChessGame()
        assert game.current_turn == 'white'
        assert len(game.move_history) == 0
        assert len(game.board) == 8
        assert len(game.board[0]) == 8
    
    def test_initial_board_setup(self):
        """Test that initial board has correct piece placement"""
        game = ChessGame()
        
        # Check white pieces
        assert game.get_piece(7, 0) == 'R'  # White rook
        assert game.get_piece(7, 4) == 'K'  # White king
        assert game.get_piece(6, 0) == 'P'  # White pawn
        
        # Check black pieces
        assert game.get_piece(0, 0) == 'r'  # Black rook
        assert game.get_piece(0, 4) == 'k'  # Black king
        assert game.get_piece(1, 0) == 'p'  # Black pawn
        
        # Check empty squares
        assert game.get_piece(3, 3) == ''
        assert game.get_piece(4, 4) == ''
    
    def test_get_piece_out_of_bounds(self):
        """Test that getting piece outside board returns None"""
        game = ChessGame()
        assert game.get_piece(-1, 0) is None
        assert game.get_piece(8, 0) is None
        assert game.get_piece(0, -1) is None
        assert game.get_piece(0, 8) is None
    
    def test_is_valid_position(self):
        """Test position validation"""
        game = ChessGame()
        
        # Valid positions
        assert game.is_valid_position(0, 0) is True
        assert game.is_valid_position(7, 7) is True
        assert game.is_valid_position(3, 4) is True
        
        # Invalid positions
        assert game.is_valid_position(-1, 0) is False
        assert game.is_valid_position(8, 0) is False
        assert game.is_valid_position(0, -1) is False
        assert game.is_valid_position(0, 8) is False
    
    def test_game_reset(self):
        """Test that game resets to initial state"""
        game = ChessGame()
        game.current_turn = 'black'
        game.move_history = ['e2e4', 'e7e5']
        
        game.reset()
        
        assert game.current_turn == 'white'
        assert len(game.move_history) == 0
        assert game.get_piece(7, 4) == 'K'  # White king back in place
    
    def test_turn_switching(self):
        """Test turn switching between players"""
        game = ChessGame()
        assert game.get_current_turn() == 'white'
        
        game.switch_turn()
        assert game.get_current_turn() == 'black'
        
        game.switch_turn()
        assert game.get_current_turn() == 'white'


class TestPosition:
    """Test cases for Position class"""
    
    def test_position_initialization(self):
        """Test position initialization"""
        fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        pos = Position(fen, tags=['opening'], name='Starting Position')
        
        assert pos.fen == fen
        assert pos.tags == ['opening']
        assert pos.name == 'Starting Position'
    
    def test_position_default_values(self):
        """Test position with default values"""
        fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        pos = Position(fen)
        
        assert pos.fen == fen
        assert pos.tags == []
        assert pos.name == ""
    
    def test_add_tag(self):
        """Test adding tags to position"""
        pos = Position("fen_string")
        
        pos.add_tag('opening')
        assert 'opening' in pos.tags
        assert len(pos.tags) == 1
        
        pos.add_tag('sicilian')
        assert 'sicilian' in pos.tags
        assert len(pos.tags) == 2
    
    def test_add_duplicate_tag(self):
        """Test that duplicate tags are not added"""
        pos = Position("fen_string", tags=['opening'])
        
        pos.add_tag('opening')
        assert pos.tags.count('opening') == 1
    
    def test_remove_tag(self):
        """Test removing tags from position"""
        pos = Position("fen_string", tags=['opening', 'sicilian', 'defense'])
        
        pos.remove_tag('sicilian')
        assert 'sicilian' not in pos.tags
        assert len(pos.tags) == 2
    
    def test_remove_nonexistent_tag(self):
        """Test removing tag that doesn't exist"""
        pos = Position("fen_string", tags=['opening'])
        
        # Should not raise an error
        pos.remove_tag('nonexistent')
        assert len(pos.tags) == 1
    
    def test_has_tag(self):
        """Test checking if position has a tag"""
        pos = Position("fen_string", tags=['opening', 'sicilian'])
        
        assert pos.has_tag('opening') is True
        assert pos.has_tag('sicilian') is True
        assert pos.has_tag('defense') is False
    
    def test_to_dict(self):
        """Test converting position to dictionary"""
        fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        pos = Position(fen, tags=['opening'], name='Starting Position')
        
        result = pos.to_dict()
        
        assert result['fen'] == fen
        assert result['tags'] == ['opening']
        assert result['name'] == 'Starting Position'
        assert isinstance(result, dict)


class TestIntegration:
    """Integration tests"""
    
    def test_game_with_positions(self):
        """Test creating positions from game state"""
        game = ChessGame()
        
        # Create position from initial game state
        fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
        position = Position(fen, name="Starting Position")
        position.add_tag("opening")
        
        assert position.has_tag("opening")
        assert game.get_current_turn() == 'white'
    
    def test_multiple_positions_management(self):
        """Test managing multiple positions"""
        positions = [
            Position("fen1", tags=['opening', 'e4'], name="Pos 1"),
            Position("fen2", tags=['opening', 'd4'], name="Pos 2"),
            Position("fen3", tags=['middlegame', 'tactics'], name="Pos 3"),
        ]
        
        # Filter positions by tag
        opening_positions = [p for p in positions if p.has_tag('opening')]
        assert len(opening_positions) == 2
        
        e4_positions = [p for p in positions if p.has_tag('e4')]
        assert len(e4_positions) == 1
