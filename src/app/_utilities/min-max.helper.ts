import { BestMove } from '../app.interfaces';
import { Player } from '../app.structs';

export class MinMaxHelper {

    private _player = Player.o;
    private _opponent = Player.x;

    evaluateResult = this._evaluate;

    constructor() { }
    /**
     * This is the minimax function. It considers all
     * the possible ways the game can go and returns
     * the value of the board
     */
    minimax(board: number[][], depth: number, isMax: boolean) {
        const score = this._evaluate(board);

        /**
         * If Maximizer has won the game return his/her
         * evaluated score
         */
        if (score === 10) {
            return score;
        }

        /**
         * If Minimizer has won the game return his/her
         * evaluated score
         */
        if (score === -10) {
            return score;
        }

        /**
         * If there are no more moves and no winner then
         * it is a tie
         */
        if (this.areMovesLeft(board) === false) {
            return 0;
        }

        // If this maximizer's move
        if (isMax) {
            let bestMax = -1000;

            // Traverse all cells
            for (let i = 0; i < board.length; i++) {
                for (let j = 0; j < board[i].length; j++) {
                    // Check if cell is empty
                    if (board[i][j] === null) {
                        // Make the move
                        board[i][j] = this._player;

                        // Call minimax recursively and choose
                        // the maximum value
                        bestMax = Math.max(bestMax,
                            this.minimax(board, depth + 1, !isMax));

                        // Undo the move
                        board[i][j] = null;
                    }
                }
            }
            return bestMax;
        } else {
            // If this minimizer's move

            let bestMin = 1000;

            // Traverse all cells
            for (let i = 0; i < board.length; i++) {
                for (let j = 0; j < board[i].length; j++) {
                    // Check if cell is empty
                    if (board[i][j] === null) {
                        // Make the move
                        board[i][j] = this._opponent;

                        // Call minimax recursively and choose
                        // the minimum value
                        bestMin = Math.min(bestMin,
                            this.minimax(board, depth + 1, !isMax));

                        // Undo the move
                        board[i][j] = null;
                    }
                }
            }
            return bestMin;
        }
    }

    private _evaluate(board: number[][]) {

        // Checking for Rows for X or O victory.
        for (let row = 0; row < board.length; row++) {

            const colVal = board[row][0];
            const winnerRow = colVal === (this._player) ? +10 : (colVal === this._opponent ? -10 : 0);
            let valsSame = true;
            for (let col = 1; col < board.length; col++) {
                if (board[row][col] !== colVal) {
                    valsSame = false;
                    break;
                }
            }
            if (valsSame) {
                return winnerRow;
            }

        }

        // Checking for Columns for X or O victory.
        for (let col = 0; col < board.length; col++) {

            const rowVal = board[0][col];
            const winnerCol = rowVal === (this._player) ? +10 : (rowVal === this._opponent ? -10 : 0);
            let valsSame = true;
            for (let row = 1; row < board.length; row++) {
                if (board[row][col] !== rowVal) {
                    valsSame = false;
                    break;
                }
            }
            if (valsSame) {
                return winnerCol;
            }

        }

        // Checking for Diagonals for X or O victory.
        const initVal = board[0][0];
        const winnerDiag = board[0][0] === (this._player) ? +10 : (board[0][0] === this._opponent ? -10 : 0);
        let valsSameDiag = true;
        for (let ij = 1; ij < board.length; ij++) {
            if (board[ij][ij] !== initVal) {
                valsSameDiag = false;
                break;
            }
        }
        if (valsSameDiag) {
            return winnerDiag;
        }

        const initValDash = board[0][board.length - 1];
        const winnerDiagDash = board[0][board.length - 1] === (this._player) ? +10 :
            (board[0][board.length - 1] === this._opponent ? -10 : 0);
        let valsSameDiagDash = true;
        for (let ij = 1; ij < board.length; ij++) {
            if (board[ij][board.length - 1 - ij] !== initValDash) {
                valsSameDiagDash = false;
                break;
            }
        }
        if (valsSameDiagDash) {
            return winnerDiagDash;
        }

        // Else if none of them have won then return 0
        return 0;
    }

    areMovesLeft(board: number[][]) {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === null) {
                    return true;
                }
            }
        }
        return false;
    }

    findBestMove(board: number[][]): BestMove {

        let bestVal = -1000;
        const bestMove: BestMove = {} as BestMove;
        bestMove.i = -1;
        bestMove.j = -1;

        /**
         * Traverse all cells, evalutae minimax function for
         * all empty cells. And return the cell with optimal
         * value.
         */
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                // Check if celll is empty
                if (board[i][j] === null) {
                    // Make the move
                    board[i][j] = this._player;

                    /**
                     * compute evaluation function for this
                     * move.
                     */
                    const moveVal = this.minimax(board, 0, false);

                    // Undo the move
                    board[i][j] = null;

                    /**
                     * If the value of the current move is
                     * more than the best value, then update
                     * best
                     */
                    if (moveVal > bestVal) {
                        bestMove.i = i;
                        bestMove.j = j;
                        bestVal = moveVal;
                    }
                }
            }
        }
        return bestMove;
    }

}
