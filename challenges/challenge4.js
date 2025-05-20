document.addEventListener('DOMContentLoaded', () => {
    const hintElements = [
        document.getElementById('hint1'),
        document.getElementById('hint2'),
        document.getElementById('hint3'),
        document.getElementById('hint4')
    ];
    
    const hints = getHints(4);
    
    for (let i = 0; i < hints.length; i++) {
        if (hintElements[i]) {
            hintElements[i].textContent = hints[i];
        }
    }
    
    function createAlphabetChart() {
        const chartHtml = `
            <div id="alphabet-chart" style="display: none; margin-top: 25px;">
                <h3>Alphabet Position Chart</h3>
                <div class="alphabet-container">
                    <div class="alphabet-row">
                        <div class="alphabet-cell"><span>A</span><span>1</span></div>
                        <div class="alphabet-cell"><span>B</span><span>2</span></div>
                        <div class="alphabet-cell"><span>C</span><span>3</span></div>
                        <div class="alphabet-cell"><span>D</span><span>4</span></div>
                        <div class="alphabet-cell"><span>E</span><span>5</span></div>
                        <div class="alphabet-cell"><span>F</span><span>6</span></div>
                        <div class="alphabet-cell"><span>G</span><span>7</span></div>
                        <div class="alphabet-cell"><span>H</span><span>8</span></div>
                        <div class="alphabet-cell"><span>I</span><span>9</span></div>
                    </div>
                    <div class="alphabet-row">
                        <div class="alphabet-cell"><span>J</span><span>10</span></div>
                        <div class="alphabet-cell"><span>K</span><span>11</span></div>
                        <div class="alphabet-cell"><span>L</span><span>12</span></div>
                        <div class="alphabet-cell"><span>M</span><span>13</span></div>
                        <div class="alphabet-cell"><span>N</span><span>14</span></div>
                        <div class="alphabet-cell"><span>O</span><span>15</span></div>
                        <div class="alphabet-cell"><span>P</span><span>16</span></div>
                        <div class="alphabet-cell"><span>Q</span><span>17</span></div>
                        <div class="alphabet-cell"><span>R</span><span>18</span></div>
                    </div>
                    <div class="alphabet-row">
                        <div class="alphabet-cell"><span>S</span><span>19</span></div>
                        <div class="alphabet-cell"><span>T</span><span>20</span></div>
                        <div class="alphabet-cell"><span>U</span><span>21</span></div>
                        <div class="alphabet-cell"><span>V</span><span>22</span></div>
                        <div class="alphabet-cell"><span>W</span><span>23</span></div>
                        <div class="alphabet-cell"><span>X</span><span>24</span></div>
                        <div class="alphabet-cell"><span>Y</span><span>25</span></div>
                        <div class="alphabet-cell"><span>Z</span><span>26</span></div>
                    </div>
                </div>
            </div>
        `;
        
        const hintContainer = document.querySelector('.hint-container');
        if (hintContainer) {
            hintContainer.insertAdjacentHTML('afterend', chartHtml);
        }
    }
    
    function setupAlphabetInteractivity() {
        const alphabetCells = document.querySelectorAll('.alphabet-cell');
        alphabetCells.forEach(cell => {
            cell.addEventListener('click', function() {
                const letter = this.querySelector('span:first-child').textContent;
                const position = this.querySelector('span:last-child').textContent;
                
                showTooltip(this, `${letter} is position ${position} in the alphabet`);
            });
        });
    }
    
    const hint3Button = document.getElementById('hint3-button');
    if (hint3Button) {
        hint3Button.addEventListener('click', () => {
            let alphabetChart = document.getElementById('alphabet-chart');
            if (!alphabetChart) {
                createAlphabetChart();
                alphabetChart = document.getElementById('alphabet-chart');
                setupAlphabetInteractivity();
            }
            
            setTimeout(() => {
                const hint3Element = document.getElementById('hint3');
                const isHint3Visible = hint3Element.style.display === 'block';
                
                if (alphabetChart) {
                    alphabetChart.style.display = isHint3Visible ? 'block' : 'none';
                }
            }, 0);
        });
    }
    
    function showTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        tooltip.style.position = 'absolute';
        tooltip.style.backgroundColor = 'rgba(0,0,0,0.8)';
        tooltip.style.color = 'white';
        tooltip.style.padding = '5px 10px';
        tooltip.style.borderRadius = '4px';
        tooltip.style.fontSize = '12px';
        tooltip.style.zIndex = '100';
        tooltip.style.pointerEvents = 'none';
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.top = rect.bottom + 5 + 'px';
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        
        setTimeout(() => {
            tooltip.style.opacity = '0';
            tooltip.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                document.body.removeChild(tooltip);
            }, 500);
        }, 2000);
    }
    
    window.validatePassword = function() {
        const password = document.getElementById('flag').value.trim().toUpperCase();
        const errorMessage = document.getElementById('error-message');
        
        if (password === atob("UFVaWkxF")) {
            completeChallenge(4);
        } else {
            errorMessage.textContent = 'Incorrect flag. Try again!';
        }
    };
});