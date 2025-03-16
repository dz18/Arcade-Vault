import { SentimentVerySatisfied } from "@mui/icons-material"
import { 
    Box, 
    IconButton, 
    Typography,
    Button
} from "@mui/material"
import { useState, useEffect } from "react"

export default function MinesweeperGame() {
    const [height, setHeight] = useState(9)
    const [width, setWidth] = useState(9)
    const [mines, setMines] = useState(10)
    const [time, setTime] = useState(0)
    const [board, setBoard] = useState([])
    const [firstClick, setFirstClick] = useState(true)
    const [gameOver, setGameOver] = useState(false)

    useEffect(() => {
        setBoard(generateEmptyBoard(height, width))
        setTime(0)
        setGameOver(false)
        setFirstClick(true)
    }, [height, width, mines])

    useEffect(() => {
        let timer
        if (!firstClick && !gameOver) {
            timer = setInterval(() => {
                setTime(prevTime => prevTime + 1)
            }, 1000)
        }

        return () => clearInterval(timer)
    }, [firstClick, gameOver])

    function generateEmptyBoard(rows, cols) {
        return Array.from({ length: rows }, () => 
            Array.from({ length: cols }, () => ({ type: 0, flipped: false, flagged: false }))
        )
    }

    function generateBoard(rows, cols, mines, safeRow, safeCol) {
        let board = generateEmptyBoard(rows, cols)
        let positions = []

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (!(r === safeRow && c === safeCol)) {
                    positions.push([r, c])
                }
            }
        }

        positions.sort(() => Math.random() - 0.5)
        const minePositions = positions.slice(0, mines)

        minePositions.forEach(([r, c]) => {
            board[r][c].type = "M"
        })

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (board[r][c].type === "M") continue
                let mineCount = 0
                for (let dr of [-1, 0, 1]) {
                    for (let dc of [-1, 0, 1]) {
                        let nr = r + dr, nc = c + dc
                        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].type === "M") {
                            mineCount++
                        }
                    }
                }
                board[r][c].type = mineCount
            }
        }

        if (board[safeRow][safeCol].type !== 0) {
            return generateBoard(rows, cols, mines, safeRow, safeCol)
        }

        return board
    }

    function checkWin(board) {
        let minesFlaggedCorrectly = 0
        let totalMines = 0
    
        board.flat().forEach(cell => {
            if (cell.type === "M") totalMines++
            if (cell.flagged && cell.type === "M") minesFlaggedCorrectly++
        })

        if (minesFlaggedCorrectly === totalMines && countFlags(board) === totalMines) {
            setGameOver(true)

            return true
        }
        return false
    }
    
    function revealAllTiles(board) {
        return board.map(row =>
            row.map(cell => ({
                ...cell,
                flipped: cell.flagged ? false : true
            }))
        );
    }

    function flip(e, row, col) {
        e.preventDefault()

        if (gameOver) {
            return
        }
    
        setBoard(prevBoard => {
            let newBoard = prevBoard.map(r => r.map(cell => ({ ...cell })))
    
            if (e.button === 0) { // Left Click
                if (newBoard[row][col].flipped || newBoard[row][col].flagged) return prevBoard
                
                if (firstClick) {
                    newBoard = generateBoard(height, width, mines, row, col)
                    setFirstClick(false)
                }
    
                if (newBoard[row][col].type === "M") {
                    alert("💥 Boom! You hit a mine! Game Over.")
                    setGameOver(true)   
                    newBoard = revealAllTiles(newBoard);
                } else {
                    revealCell(newBoard, row, col)
                }
    
            } else if (e.button === 2) { // Right Click
                if (!newBoard[row][col].flipped) {
                    newBoard[row][col].flagged = !newBoard[row][col].flagged
                }
            }
    
            if (checkWin(newBoard)) {
                alert("You Win")
                revealAllTiles(newBoard)
            }
    
            return newBoard
        })
    }
    
    function resetGame(height, width, mines) {
        setHeight(height)
        setWidth(width)
        setMines(mines)
        setFirstClick(true)
        setGameOver(false)
        setTime(0)
        setBoard(generateEmptyBoard(height, width))
    }

    function revealCell(board, row, col) {
        if (row < 0 || row >= height || col < 0 || col >= width || board[row][col].flipped) return

        board[row][col].flipped = true

        if (board[row][col].type === 0) {
            for (let dr of [-1, 0, 1]) {
                for (let dc of [-1, 0, 1]) {
                    if (dr !== 0 || dc !== 0) {
                        revealCell(board, row + dr, col + dc)
                    }
                }
            }
        }
    }

    function countFlags(board) {
        return board.flat().reduce((count, cell) => count + (cell.flagged ? 1 : 0), 0)
    }

    return (
        <Box mt={5} textAlign="center" justifyContent='center'>

            <Typography variant="h3">Minesweeper</Typography>
            <Typography variant="h6" color="grey">Find & Flag all the mines</Typography>

            <Box mt={2}>
                <Button variant='outlined' onClick={() => resetGame(9,9,10)}>Easy</Button>
                <Button variant='outlined' onClick={() => resetGame(16,16,40)}>Intermediate</Button>
                <Button variant='outlined' onClick={() => resetGame(16,30,99)}>Expert</Button>
            </Box>

            <Box 
                p={2} mt={2} bgcolor="lightgrey" borderRadius={2}
                display='flex' flexDirection='column' justifyContent='center'
            >
                
                <Box display="flex" alignItems="center" justifyContent='center'>
                    <Typography variant="h5" bgcolor="black" color="white" p={1} borderRadius={1} width={30}>
                        {mines - countFlags(board)}
                    </Typography>

                    <IconButton onClick={() => resetGame(height, width, mines)}>
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
                                    onContextMenu={gameOver ? undefined : (e) => flip(e, rowIndex, colIndex)} // Right-click flagging
                                    sx={{ cursor: gameOver ? "not-allowed" : "pointer"}} // Right-click flagging
                                >
                                    {"🚩"}
                                </Box>
                            :
                                <Box
                                    key={`${rowIndex}-${colIndex}`}
                                    width={20} height={20}
                                    display="flex" alignItems="center" justifyContent="center"
                                    bgcolor="darkgray"
                                    border="1px solid black"
                                    onClick={(e) => flip(e, rowIndex, colIndex)}
                                    onContextMenu={gameOver ? undefined : (e) => flip(e, rowIndex, colIndex)} // Right-click flagging
                                    sx={{ cursor: gameOver ? "not-allowed" : "pointer"}} // Right-click flagging
                                />
                            )
                        ))
                    )}
                </Box>
            </Box>
        </Box>
    );
}
