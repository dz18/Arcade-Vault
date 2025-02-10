import { SentimentVerySatisfied } from "@mui/icons-material";
import { 
    Box, 
    IconButton, 
    Typography,
    Button
} from "@mui/material";
import { useState, useEffect } from "react";

export default function MinesweeperGame() {
    const [height, setHeight] = useState(9);
    const [width, setWidth] = useState(9);
    const [mines, setMines] = useState(10);
    const [flagsPlaced, setFlagsPlaced] = useState(0);
    const [time, setTime] = useState(0);
    const [board, setBoard] = useState([]);
    const [firstClick, setFirstClick] = useState(true);

    useEffect(() => {
        setBoard(generateEmptyBoard(height, width));
    }, [height, width, mines]);

    function generateEmptyBoard(rows, cols) {
        return Array.from({ length: rows }, () => 
            Array.from({ length: cols }, () => ({ type: 0, flipped: false, flagged: false }))
        );
    }

    function generateBoard(rows, cols, mines, safeRow, safeCol) {
        let board = generateEmptyBoard(rows, cols);
        let positions = [];

        // Create all possible positions except the first clicked one
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (!(r === safeRow && c === safeCol)) {
                    positions.push([r, c]);
                }
            }
        }

        // Shuffle positions and pick first 'mines' elements
        positions.sort(() => Math.random() - 0.5);
        const minePositions = positions.slice(0, mines);

        // Place mines
        minePositions.forEach(([r, c]) => {
            board[r][c].type = "M";
        });

        // Calculate numbers around mines
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (board[r][c].type === "M") continue;
                let mineCount = 0;
                for (let dr of [-1, 0, 1]) {
                    for (let dc of [-1, 0, 1]) {
                        let nr = r + dr, nc = c + dc;
                        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].type === "M") {
                            mineCount++;
                        }
                    }
                }
                board[r][c].type = mineCount;
            }
        }

        // Ensure first-clicked cell is an empty (`0`) cell
        if (board[safeRow][safeCol].type !== 0) {
            return generateBoard(rows, cols, mines, safeRow, safeCol);
        }

        return board;
    }

    function changeDifficulty(height, width, mines) {
        setHeight(height);
        setWidth(width);
        setMines(mines);
        setFirstClick(true);
        setBoard(generateEmptyBoard(height, width));
    }

    function flip(e, row, col) {
        e.preventDefault(); // Prevent default right-click menu
    
        setBoard(prevBoard => {
            let newBoard = prevBoard.map(r => r.map(cell => ({ ...cell }))); // Deep copy board
    
            if (e.button === 0) {
                if (newBoard[row][col].flipped || newBoard[row][col].flagged) return prevBoard; // Ignore flagged/flipped cells
    
                if (firstClick) {
                    newBoard = generateBoard(height, width, mines, row, col);
                    setFirstClick(false);
                }
                
                revealCell(newBoard, row, col);
            } 
            else if (e.button === 2) {
                // Toggle flag
                if (!newBoard[row][col].flipped) {
                    newBoard[row][col].flagged = !newBoard[row][col].flagged;
                    setFlagsPlaced(flags => newBoard[row][col].flagged ? flags + 1 : flags - 1);
                }
            }
    
            return newBoard;
        });
    }
        

    function revealCell(board, row, col) {
        if (row < 0 || row >= height || col < 0 || col >= width || board[row][col].flipped) return;

        board[row][col].flipped = true;

        if (board[row][col].type === 0) {
            for (let dr of [-1, 0, 1]) {
                for (let dc of [-1, 0, 1]) {
                    if (dr !== 0 || dc !== 0) {
                        revealCell(board, row + dr, col + dc);
                    }
                }
            }
        }
    }

    return (
        <Box mt={5} textAlign="center" justifyContent='center'>

            <Typography variant="h3">Minesweeper</Typography>
            <Typography variant="h6" color="grey">Find & Flag all the mines</Typography>

            <Box mt={2}>
                <Button variant='outlined' onClick={() => changeDifficulty(9,9,10)}>Easy</Button>
                <Button variant='outlined' onClick={() => changeDifficulty(16,16,40)}>Intermediate</Button>
                <Button variant='outlined' onClick={() => changeDifficulty(16,30,99)}>Expert</Button>
            </Box>

            <Box 
                p={2} mt={2} bgcolor="lightgrey" borderRadius={2}
                display='flex' flexDirection='column' justifyContent='center'
            >
                
                <Box display="flex" alignItems="center" justifyContent='center'>
                    <Typography variant="h5" bgcolor="black" color="white" p={1} borderRadius={1} width={30}>
                        {mines - flagsPlaced}
                    </Typography>
                    <IconButton>
                        <SentimentVerySatisfied fontSize="large" />
                    </IconButton>
                    <Typography variant="h5" bgcolor="black" color="white" p={1} borderRadius={1} width={30}>
                        {time}
                    </Typography>
                </Box>

                <Box 
                    mt={2} 
                    display="grid"
                    gridTemplateColumns={`repeat(${width}, 20px)`} 
                    gap={0.5}
                    justifyContent='center'
                >
                    {board.map((row, rowIndex) =>
                        row.map((cell, colIndex) => (
                            cell.flipped ?
                                <Box
                                    key={`${rowIndex}-${colIndex}`}
                                    width={20} height={20}
                                    display="flex" alignItems="center" justifyContent="center"
                                    bgcolor="lightgray"
                                    border="1px solid black"
                                >
                                    {cell.type === "M" ? "💣" : cell.type !== 0 ? cell.type : ""}
                                </Box>
                            :
                            (cell.flagged ?
                                <Box
                                    key={`${rowIndex}-${colIndex}`}
                                    width={20} height={20}
                                    display="flex" alignItems="center" justifyContent="center"
                                    bgcolor="darkgray"
                                    border="1px solid black"
                                    onClick={(e) => flip(e, rowIndex, colIndex)}
                                    onContextMenu={(e) => flip(e, rowIndex, colIndex)} // Right-click flagging
                                    sx={{ cursor: "pointer" }}
                                >
                                    {cell.flagged ? "🚩" : ""}
                                </Box>
                            :
                                <Box
                                    key={`${rowIndex}-${colIndex}`}
                                    width={20} height={20}
                                    display="flex" alignItems="center" justifyContent="center"
                                    bgcolor="darkgray"
                                    border="1px solid black"
                                    onClick={(e) => flip(e, rowIndex, colIndex)}
                                    sx={{ cursor: "pointer" }}
                                />
                            )
                        ))
                    )}
                </Box>
            </Box>
        </Box>
    );
}
