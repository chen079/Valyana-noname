import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

export default {
    enable: "phaseUse",
    async content(event, trigger, player) {
						const m = Math.floor(Math.random() * 4) + 1
						const n = Math.floor(Math.random() * 4) + 1
						const k = Math.floor(Math.random() * 4) + 1
						function generateRandomMatrix(m, n, min, max) {
							// 创建一个大小为m x n的空数组
							const matrix = new Array(m);
							for (let i = 0; i < m; i++) {
								matrix[i] = new Array(n);
							}
							// 填充数组的每个元素为随机数（范围在[min, max]之间）
							for (let i = 0; i < m; i++) {
								for (let j = 0; j < n; j++) {
									matrix[i][j] = Math.floor(Math.random() * (max - min + 1)) + min;
								}
							}
							return matrix;
						}
						const MatrixA = math.matrix(generateRandomMatrix(m, n, 1, 10))
						const MatrixB = math.matrix(generateRandomMatrix(n, k, 1, 10))
						const MatrixC = math.multiply(MatrixA, MatrixB);
						console.log(MatrixC.toString())
						const result = await player.chooseText().set('prompt2', '已知矩阵A为' + MatrixA.toString() + '，矩阵B为' + MatrixB.toString() + '，则二者的矩阵乘积为？').set('prompt', '是否发动【矩阵】？')
							.set('ai', function () {
								return MatrixC.toString()
							}).forResult();
						if (result.text.replace(/\s+/g, '') == MatrixC.toString().replace(/\s+/g, '')) {
							await player.draw(5)
							game.log(player, '回答正确')
						} else {
							game.log(player, '回答错误')
						}
    },
    t: {
        name: "矩阵",
        info: "出牌阶段，你计算两个矩阵的乘积，若你回答正确，你摸五张牌。",
    },
};
