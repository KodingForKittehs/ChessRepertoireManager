"""
Sample chess game logic for testing purposes
"""

class ChessGame:
    """A simple chess game class for managing game state"""
    
    def __init__(self):
        self.board = self._initialize_board()
        self.current_turn = 'white'
        self.move_history = []
    
    def _initialize_board(self):
        """Initialize chess board with starting position"""
        return [
            ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
        ]
    
    def get_piece(self, row, col):
        """Get piece at given position"""
        if 0 <= row < 8 and 0 <= col < 8:
            return self.board[row][col]
        return None
    
    def is_valid_position(self, row, col):
        """Check if position is within board bounds"""
        return 0 <= row < 8 and 0 <= col < 8
    
    def reset(self):
        """Reset game to initial state"""
        self.board = self._initialize_board()
        self.current_turn = 'white'
        self.move_history = []
    
    def get_current_turn(self):
        """Get current player's turn"""
        return self.current_turn
    
    def switch_turn(self):
        """Switch to other player's turn"""
        self.current_turn = 'black' if self.current_turn == 'white' else 'white'


class Position:
    """Represents a chess position for repertoire management"""
    
    def __init__(self, fen, tags=None, name=""):
        self.fen = fen
        self.tags = tags or []
        self.name = name
    
    def add_tag(self, tag):
        """Add a tag to the position"""
        if tag not in self.tags:
            self.tags.append(tag)
    
    def remove_tag(self, tag):
        """Remove a tag from the position"""
        if tag in self.tags:
            self.tags.remove(tag)
    
    def has_tag(self, tag):
        """Check if position has a specific tag"""
        return tag in self.tags
    
    def to_dict(self):
        """Convert position to dictionary"""
        return {
            'fen': self.fen,
            'tags': self.tags,
            'name': self.name
        }
