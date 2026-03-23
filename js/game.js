document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const openingForm = document.getElementById('opening-form');
    const dialogueScene = document.getElementById('dialogue-scene');
    const woodsScene = document.getElementById('woods-scene');
    const caveScene = document.getElementById('cave-scene');
    const travelScene = document.getElementById('travel-scene');
    const playerNameInput = document.getElementById('player-name');
    const submitNameBtn = document.getElementById('submit-name');
    const dialogueText = document.getElementById('dialogue-text');
    const npcImage = document.getElementById('npc-image');
    const optionsDiv = document.getElementById('options');
    const startText = document.querySelector('.start-text');
    const promptText = document.querySelector('.prompt');
    const loadGameBtn = document.getElementById('load-game-btn');

    // Woods scene elements
    const inventoryBtn = document.getElementById('inventory-btn');
    const relationshipsBtn = document.getElementById('relationships-btn');
    const inventoryPanel = document.getElementById('inventory-panel');
    const relationshipsPanel = document.getElementById('relationships-panel');
    const closeInventoryBtn = document.getElementById('close-inventory');
    const closeRelationshipsBtn = document.getElementById('close-relationships');
    const woodsDialogueText = document.getElementById('woods-dialogue-text');
    const woodsOptions = document.getElementById('woods-options');
    const woodsNpcImage = document.getElementById('woods-npc-image');
    const woodsNpcName = document.getElementById('woods-npc-name');
    const menuBtn = document.getElementById('menu-btn');

    // Cave scene elements
    const caveDialogueText = document.getElementById('cave-dialogue-text');
    const caveOptions = document.getElementById('cave-options');
    const caveMenuBtn = document.getElementById('cave-menu-btn');
    const caveInventoryBtn = document.getElementById('cave-inventory-btn');
    const caveRelationshipsBtn = document.getElementById('cave-relationships-btn');

    // Travel scene elements
    const travelDialogueText = document.getElementById('travel-dialogue-text');
    const travelOptions = document.getElementById('travel-options');
    const travelNpcImage = document.getElementById('travel-npc-image');
    const travelMenuBtn = document.getElementById('travel-menu-btn');
    const travelInventoryBtn = document.getElementById('travel-inventory-btn');
    const travelRelationshipsBtn = document.getElementById('travel-relationships-btn');

    const gameState = { 
        playerName: null,
        currentScene: 'loading',
        responses: {},
        inventory: [],
        relationships: {
            talia: 0
        },
        caveExplorations: 0,
        cameFromCave: false,
        musicPlaying: false
    };

    // Click sound for all interactions
    const clickSound = new Audio('assets/click.wav');
    clickSound.volume = 0.5; // Increased from 0.3 to 0.5
    
    // Sparkle effect function
    function createSparkles(x, y) {
        const sparkleCount = 8; // Number of sparkles
        
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.backgroundImage = 'url(assets/staranimation.png)';
            
            // Random direction for each sparkle
            const angle = (Math.PI * 2 * i) / sparkleCount;
            const distance = 60 + Math.random() * 60; // 60-120px distance (increased again)
            const xOffset = Math.cos(angle) * distance;
            const yOffset = Math.sin(angle) * distance;
            
            // Random size variation
            const size = 50 + Math.random() * 30; // 50-80px (increased from 35-60px)
            sparkle.style.width = size + 'px';
            sparkle.style.height = size + 'px';
            
            // Set position
            sparkle.style.left = x + 'px';
            sparkle.style.top = y + 'px';
            
            // Set CSS variables for animation
            sparkle.style.setProperty('--x', xOffset + 'px');
            sparkle.style.setProperty('--y', yOffset + 'px');
            
            document.body.appendChild(sparkle);
            
            // Remove sparkle after animation completes
            setTimeout(() => {
                document.body.removeChild(sparkle);
            }, 800);
        }
    }
    
    // Add click sound and sparkles to all buttons and clickable elements
    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.classList.contains('clickable')) {
            clickSound.currentTime = 0;
            clickSound.play().catch(err => console.log('Click sound failed:', err));
            
            // Create sparkles at click position
            createSparkles(e.clientX, e.clientY);
        }
    });

    // Background Music Setup
    const backgroundMusic = new Audio('assets/Dmitri_Shostakovich_-_Waltz_No__2.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3; // 30% volume - adjust between 0.0 and 1.0

    // Try to start music immediately on page load
    backgroundMusic.play().then(() => {
        gameState.musicPlaying = true;
        console.log('Background music started automatically');
    }).catch(error => {
        console.log('Autoplay blocked by browser, will start on user interaction:', error);
        gameState.musicPlaying = false;
    });

    // Function to start music (fallback for browsers that block autoplay)
    function startBackgroundMusic() {
        if (!gameState.musicPlaying && backgroundMusic.paused) {
            backgroundMusic.play().then(() => {
                gameState.musicPlaying = true;
                console.log('Background music started on user interaction');
            }).catch(error => {
                console.log('Music play failed:', error);
            });
        }
    }

    // Function to toggle music on/off
    function toggleMusic() {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            gameState.musicPlaying = true;
        } else {
            backgroundMusic.pause();
            gameState.musicPlaying = false;
        }
    }

    // Cave loot table with probabilities (20 items)
    const caveLootTable = [
        { name: 'Moonberries', rarity: 'Common', probability: 5, image: '/assets/moonberries.png', description: 'Glowing berries that shimmer under moonlight. Sweet and refreshing.' },
        { name: 'Emberfruit Pie', rarity: 'Common', probability: 5, image: '/assets/emberfruit.png', description: 'A warm pie filled with spiced fruit that glows like embers.' },
        { name: 'Solstice Tomato Salad', rarity: 'Common', probability: 5, image: '/assets/solsticetomatosalad.png', description: 'Fresh tomatoes harvested at the peak of summer solstice.' },
        { name: 'Starfall Cider', rarity: 'Common', probability: 5, image: '/assets/starfallcider.png', description: 'Sparkling cider that seems to contain tiny stars.' },
        { name: 'Mystery Dish', rarity: 'Common', probability: 5, image: '/assets/mysterydish.png', description: 'A curious dish with an ever-changing flavor.' },
        { name: 'Icy Jag Fish', rarity: 'Common', probability: 5, image: '/assets/icyjagfish.png', description: 'A fish from frozen waters with crisp, clean meat.' },
        { name: 'Whisperleaf Tea', rarity: 'Common', probability: 5, image: '/assets/whisperleaftea.png', description: 'Calming tea made from leaves that seem to whisper.' },
        { name: 'Honeycomb Cookie', rarity: 'Common', probability: 5, image: '/assets/honeycombcookie.png', description: 'Sweet cookies with a delicate honeycomb pattern.' },
        { name: 'Savory Pie', rarity: 'Common', probability: 5, image: '/assets/savorypie.png', description: 'A hearty pie filled with herbs and meat.' },
        { name: 'Phoenix Chicken Wing', rarity: 'Common', probability: 5, image: '/assets/phoenixchickenwing.png', description: 'Spicy chicken wings that warm you from within.' },
        { name: 'Blackberry Brisket Burger', rarity: 'Common', probability: 5, image: '/assets/blackberrybrisketburger.png', description: 'Juicy burger with sweet blackberry sauce.' },
        { name: 'Dragonfire Stew', rarity: 'Common', probability: 5, image: '/assets/dragonfirestew.png', description: 'Intensely spicy stew that breathes like dragon fire.' },
        { name: 'Glimmerwine', rarity: 'Common', probability: 5, image: '/assets/glimmerwine.png', description: 'Elegant wine that glimmers with magic.' },
        { name: 'Sylvan Peppers', rarity: 'Common', probability: 5, image: '/assets/sylvanpeppers.png', description: 'Rare peppers from the ancient forest.' },
        { name: 'Mistfruit Parfait', rarity: 'Common', probability: 5, image: '/assets/mistfruitparfait.png', description: 'Layered dessert with ethereal mist-touched fruit.' },
        { name: 'Luminara Chocolate', rarity: 'Common', probability: 5, image: '/assets/luminarachocolate.png', description: 'Exquisite chocolate that glows softly.' },
        { name: 'Heartfire Stone', rarity: 'Uncommon', probability: 4, image: '/assets/heartfirestone.png', description: 'A warm crystal that pulses with inner fire.' },
        { name: 'Moonstone', rarity: 'Uncommon', probability: 4, image: '/assets/moonstone.png', description: 'A pale stone that reflects moonlight beautifully.' },
        { name: 'Starlight Rock', rarity: 'Uncommon', probability: 4, image: '/assets/starlightrock.png', description: 'A crystalline rock containing captured starlight.' },
        { name: 'Dreamshard', rarity: 'Uncommon', probability: 4, image: '/assets/dreamshard.png', description: 'A mysterious shard from the realm of dreams.' }
    ];


    // Typewriter effect function with skip capability and optional Next button
    let skipTypewriter = false;
    let currentSkipButton = null;
    let currentNextButton = null;

    function typeWriter(element, text, speed = 50, showNext = false) {
        element.textContent = '';
        element.classList.add('typing');
        skipTypewriter = false;
        let i = 0;
        
        // Clean up any existing Next button from previous typewriter calls
        if (currentNextButton && currentNextButton.parentNode) {
            document.body.removeChild(currentNextButton);
            currentNextButton = null;
        }
        
        // Add skip button
        if (!currentSkipButton) {
            currentSkipButton = document.createElement('button');
            currentSkipButton.className = 'skip-typewriter-btn';
            currentSkipButton.textContent = 'Skip ►';
            currentSkipButton.onclick = () => {
                skipTypewriter = true;
            };
            document.body.appendChild(currentSkipButton);
        }
        
        return new Promise((resolve) => {
            function type() {
                if (skipTypewriter || i >= text.length) {
                    element.textContent = text;
                    element.classList.remove('typing');
                    
                    // Remove skip button
                    if (currentSkipButton) {
                        document.body.removeChild(currentSkipButton);
                        currentSkipButton = null;
                    }
                    
                    // Add Next button only if showNext is true
                    if (showNext) {
                        currentNextButton = document.createElement('button');
                        currentNextButton.className = 'next-typewriter-btn';
                        currentNextButton.textContent = 'Next ►';
                        currentNextButton.onclick = () => {
                            if (currentNextButton && currentNextButton.parentNode) {
                                document.body.removeChild(currentNextButton);
                            }
                            currentNextButton = null;
                            resolve();
                        };
                        document.body.appendChild(currentNextButton);
                    } else {
                        // No Next button, resolve immediately
                        resolve();
                    }
                } else {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                }
            }
            type();
        });
    }

    // Get random item from loot table
    function getRandomLoot() {
        const roll = Math.random() * 100;
        let cumulative = 0;
        
        for (let item of caveLootTable) {
            cumulative += item.probability;
            if (roll <= cumulative) {
                return item;
            }
        }
        
        return caveLootTable[0];
    }

    // Update inventory display
    function updateInventoryDisplay() {
        const inventoryItems = document.getElementById('inventory-items');
        
        if (gameState.inventory.length === 0) {
            inventoryItems.innerHTML = '<p class="empty-message">Your inventory is empty</p>';
        } else {
            let html = '';
            const itemMap = {};
            
            // Count items and store full item data
            gameState.inventory.forEach(item => {
                if (!itemMap[item.name]) {
                    itemMap[item.name] = {
                        item: item,
                        count: 0
                    };
                }
                itemMap[item.name].count++;
            });
            
            // Create grid items
            for (let itemName in itemMap) {
                const { item, count } = itemMap[itemName];
                html += `
                    <div class="inventory-item">
                        <img src="${item.image}" alt="${item.name}" class="inventory-item-image" />
                        <div class="inventory-item-name">${item.name}</div>
                        <div class="inventory-item-count">x${count}</div>
                        <div class="inventory-item-tooltip">
                            <div class="inventory-item-tooltip-title">${item.name}</div>
                            <div class="inventory-item-tooltip-rarity">Rarity: ${item.rarity}</div>
                            <div class="inventory-item-tooltip-description">${item.description}</div>
                        </div>
                    </div>
                `;
            }
            
            inventoryItems.innerHTML = html;
            
            // Add dynamic tooltip positioning to prevent cutoff
            setTimeout(() => {
                const items = document.querySelectorAll('.inventory-item');
                const panel = document.getElementById('inventory-panel');
                
                items.forEach((item, index) => {
                    item.addEventListener('mouseenter', function() {
                        const tooltip = this.querySelector('.inventory-item-tooltip');
                        const itemRect = this.getBoundingClientRect();
                        const panelRect = panel.getBoundingClientRect();
                        const tooltipRect = tooltip.getBoundingClientRect();
                        
                        // Check if tooltip goes off top of panel
                        if (itemRect.top - tooltipRect.height - 10 < panelRect.top) {
                            // Show below instead
                            tooltip.style.bottom = 'auto';
                            tooltip.style.top = '100%';
                            tooltip.style.marginBottom = '0';
                            tooltip.style.marginTop = '10px';
                        }
                        
                        // Check if tooltip goes off left edge
                        if (itemRect.left + (itemRect.width / 2) - (tooltipRect.width / 2) < panelRect.left) {
                            tooltip.style.left = '0';
                            tooltip.style.transform = 'none';
                        }
                        
                        // Check if tooltip goes off right edge
                        if (itemRect.left + (itemRect.width / 2) + (tooltipRect.width / 2) > panelRect.right) {
                            tooltip.style.left = 'auto';
                            tooltip.style.right = '0';
                            tooltip.style.transform = 'none';
                        }
                    });
                });
            }, 100);
        }
    }


    // Cave Scene starter
    function startCaveScene() {
        console.log('Cave scene started!');
        
        const introText = "You step into a shadowed cavern, where water drips steadily from jagged stone, echoing through the darkness. The ground is strewn with remnants of a forgotten cargo crates, frayed coils of rope, and rusted debris scattered like bones of an old world. Perhaps, if you search the abandoned mine carts or pry open the weathered boxes, you might uncover something of value...but before you can move, a figure emerges from the shadows.";
        
        if (!caveDialogueText) {
            console.error('Cave dialogue text element not found!');
            return;
        }
        
        console.log('Starting typewriter for intro text');
        typeWriter(caveDialogueText, introText, 30, true).then(() => {
            console.log('Intro text finished, showing wizard');
            setTimeout(() => {
                showWizardIntro();
            }, 1000);
        });
    }

    // Show wizard introduction
    function showWizardIntro() {
        const wizardSpeech = "Ah… thou return'st to mine hall of shadow. Once didst thou plead for favor, a boon to mend thy broken bonds. And aye, thy wish was granted, though at a grievous cost. Thy yesterdays lie shorn from thee, yet if thy heart still yearneth for love's embrace, I shall lend thee mine aid—but first, thou must unravel a riddle of mine own devising.";
        
        caveDialogueText.innerHTML = `
            <img src="/assets/wizard.png" style="width: 200px; display: block; margin: 0 auto 20px; border: 3px solid lightblue; border-radius: 12px; padding: 8px; background: black; box-shadow: 0 0 20px rgba(173, 216, 230, 0.5);">
            <p style="color: lightblue; font-weight: bold; margin-bottom: 15px; text-align: center;">A Mysterious Wizard</p>
            <p id="wizard-speech-text"></p>
        `;
        
        const speechElement = document.getElementById('wizard-speech-text');
        typeWriter(speechElement, wizardSpeech, 30, true).then(() => {
            setTimeout(() => {
                showWizardRiddle();
            }, 1500);
        });
    }

    // Show wizard riddle challenge
    function showWizardRiddle() {
        caveDialogueText.innerHTML = `
            <img src="/assets/wizard.png" style="width: 150px; display: block; margin: 0 auto 20px; border: 3px solid lightblue; border-radius: 12px; padding: 8px; background: black;">
            <p style="color: lightblue; font-weight: bold; margin-bottom: 15px;">"Hearken well to my riddle:"</p>
            <p>"What has roots as nobody sees,<br>
            Is taller than trees,<br>
            Up, up it goes,<br>
            And yet never grows?"</p>
        `;
        
        caveOptions.innerHTML = `
            <button class="cave-option" data-answer="mountain">A mountain</button>
            <button class="cave-option" data-answer="flower">A flower</button>
            <button class="cave-option" data-answer="shadow">A shadow</button>
        `;
        
        document.querySelectorAll('.cave-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const answer = btn.getAttribute('data-answer');
                caveOptions.innerHTML = '';
                handleRiddleAnswer(answer);
            });
        });
    }

    // Handle riddle answer
    function handleRiddleAnswer(answer) {
        if (answer === 'mountain') {
            // Correct answer - give item
            const item = getRandomLoot();
            gameState.inventory.push(item);
            
            console.log('Correct answer! Found item:', item.name);
            
            updateInventoryDisplay();
            
            caveDialogueText.innerHTML = `
                <img src="/assets/wizard.png" style="width: 150px; display: block; margin: 0 auto 20px; border: 3px solid lightblue; border-radius: 12px; padding: 8px; background: black;">
                <p style="color: lime; font-weight: bold; margin-bottom: 20px; font-size: 28px;">Correct!</p>
                <p style="margin-bottom: 20px;">"Wisely spoken! Thou hast earned thy reward."</p>
                <img src="${item.image}" style="width: 150px; height: 150px; object-fit: contain; display: block; margin: 20px auto; border: 3px solid gold; border-radius: 12px; padding: 8px; background: black; box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);">
                <p style="margin-top: 20px;">You received <span class="item-found">${item.name}</span>!</p>
                <p style="color: gray; margin-top: 15px; font-size: 18px;">The item has been added to your inventory.</p>
                <p id="item-reward-continue" style="visibility: hidden;"></p>
            `;
            
            
            // Show Next button so player can read and check inventory
            const itemRewardContinue = document.getElementById('item-reward-continue');
            typeWriter(itemRewardContinue, "", 1, true).then(() => {
                // After Next is clicked, show farewell
                caveDialogueText.innerHTML = `
                    <img src="/assets/wizard.png" style="width: 150px; display: block; margin: 0 auto 20px; border: 3px solid lightblue; border-radius: 12px; padding: 8px; background: black;">
                    <p id="wizard-farewell-text"></p>
                `;
                
                const farewellElement = document.getElementById('wizard-farewell-text');
                const farewell = "Go forth now, brave soul. Fare thee well, until fate doth bring us to meet once more.";
                
                typeWriter(farewellElement, farewell, 30, true).then(() => {
                    // Fade to travel scene
                    setTimeout(() => {
                        caveScene.style.transition = 'opacity 2s';
                        caveScene.style.opacity = '0';
                        
                        setTimeout(() => {
                            gameState.currentScene = 'travel';
                            gameState.cameFromCave = true;
                            caveScene.classList.add('hidden');
                            caveScene.style.opacity = '1';
                            caveScene.style.transition = '';
                            console.log('Going to Travel Scene');
                            travelScene.classList.remove('hidden'); startTravelScene();
                        }, 2000);
                    }, 1500);
                });
            });
        } else {
            // Wrong answer - no item
            console.log('Wrong answer! No item received.');
            
            caveDialogueText.innerHTML = `
                <img src="/assets/wizard.png" style="width: 150px; display: block; margin: 0 auto 20px; border: 3px solid lightblue; border-radius: 12px; padding: 8px; background: black;">
                <p style="color: red; font-weight: bold; margin-bottom: 20px; font-size: 28px;">Incorrect!</p>
                <p>"Foolish mortal! The answer was 'A mountain.' Thou hast failed, and so shalt leave with naught but the shadows that brought thee hither."</p>
                <p style="color: gray; margin-top: 20px;">The wizard vanishes into the darkness, leaving you empty-handed.</p>
            `;
            
            // Show continue option after delay
            setTimeout(() => {
                caveOptions.innerHTML = `
                    <button class="cave-option" data-action="travel">Leave the Cave</button>
                `;
                
                document.querySelector('.cave-option').addEventListener('click', () => {
                    gameState.currentScene = 'travel';
                    gameState.cameFromCave = true;
                    caveScene.classList.add('hidden');
                    console.log('Going to Travel Scene');
                    travelScene.classList.remove('hidden'); startTravelScene();
                });
            }, 2000);
        }
    }

    // Update relationship hearts display
    function updateRelationshipHearts(npc, hearts) {
        const heartElements = document.querySelectorAll('.npc-card .heart');
        heartElements.forEach((heart, index) => {
            if (index < hearts) {
                heart.classList.remove('empty');
                heart.classList.add('filled');
            } else {
                heart.classList.remove('filled');
                heart.classList.add('empty');
            }
        });
    }

    // Show heart notification
    function showHeartNotification(npcName) {
        // Play notification sound
        const notificationSound = new Audio('assets/notification.wav');
        notificationSound.volume = 0.5;
        notificationSound.play().catch(err => console.log('Notification sound failed:', err));
        
        const notification = document.createElement('div');
        notification.className = 'heart-notification';
        notification.innerHTML = `+1 ♥<br>${npcName} liked that`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 2000);
    }


    // Check if there's a saved game on load
    window.addEventListener('load', () => {
        let hasSavedGames = false;
        for (let i = 1; i <= 10; i++) {
            if (localStorage.getItem(`aureliaGameState_${i}`)) {
                hasSavedGames = true;
                console.log('Found saved game in slot', i);
                break;
            }
        }
        if (hasSavedGames) {
            console.log('Showing load game button');
            loadGameBtn.classList.remove('hidden');
        } else {
            console.log('No saved games found');
        }
    });

    // Load game button
    loadGameBtn.addEventListener('click', () => {
        showLoadSlotsModal();
    });

    // Show modal popup
    function showModal(question, onYes, onNo) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-box">
                <p class="modal-question">${question}</p>
                <div class="modal-buttons">
                    <button class="modal-btn yes-btn">Yes</button>
                    <button class="modal-btn no-btn">No</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('.yes-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
            onYes();
        });

        modal.querySelector('.no-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
            onNo();
        });
    }
    // Show menu modal
    function showMenuModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        const musicStatus = backgroundMusic.paused ? 'OFF' : 'ON';
        modal.innerHTML = `
            <div class="menu-modal-box">
                <h2>Menu</h2>
                <div class="menu-options">
                    <button class="menu-option-btn" data-action="restart">Restart</button>
                    <button class="menu-option-btn" data-action="save">Save</button>
                    <button class="menu-option-btn" data-action="music">Music: ${musicStatus}</button>
                    <button class="menu-option-btn" data-action="quit">Quit and Save</button>
                    <button class="menu-option-btn cancel" data-action="cancel">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelectorAll('.menu-option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.getAttribute('data-action');
                
                if (action === 'music') {
                    // Toggle music and update button
                    toggleMusic();
                    const newStatus = backgroundMusic.paused ? 'OFF' : 'ON';
                    btn.textContent = `Music: ${newStatus}`;
                } else {
                    document.body.removeChild(modal);
                    handleMenuAction(action);
                }
            });
        });
    }

    // Handle menu actions
    function handleMenuAction(action) {
        if (action === 'restart') {
            if (confirm('Are you sure you want to restart? All unsaved progress will be lost.')) {
                location.reload();
            }
        } else if (action === 'save') {
            showSaveSlotsModal();
        } else if (action === 'quit') {
            showSaveSlotsModal(true);
        }
    }

    // Show save slots modal
    function showSaveSlotsModal(quitAfter = false) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        
        let slotsHTML = '<div class="menu-modal-box"><h2>Select Save Slot</h2><div class="save-slots-container">';
        
        for (let i = 1; i <= 10; i++) {
            const savedData = localStorage.getItem(`aureliaGameState_${i}`);
            if (savedData) {
                const data = JSON.parse(savedData);
                slotsHTML += `
                    <div class="save-slot" data-slot="${i}">
                        <div class="save-slot-header">
                            <span class="save-slot-number">Slot ${i}</span>
                            <span class="save-slot-date">${new Date(data.saveDate).toLocaleString()}</span>
                            <button class="delete-save-btn" data-slot="${i}" onclick="event.stopPropagation()">🗑️</button>
                        </div>
                        <div class="save-slot-info">Player: ${data.playerName}</div>
                    </div>
                `;
            } else {
                slotsHTML += `
                    <div class="save-slot empty" data-slot="${i}">
                        <div class="save-slot-header">
                            <span class="save-slot-number">Slot ${i}</span>
                        </div>
                        <div class="save-slot-info">Empty Slot</div>
                    </div>
                `;
            }
        }
        
        slotsHTML += '</div><button class="menu-option-btn cancel">Cancel</button></div>';
        modal.innerHTML = slotsHTML;
        document.body.appendChild(modal);


        // Add delete button listeners
        modal.querySelectorAll('.delete-save-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const slotNum = btn.getAttribute('data-slot');
                if (confirm(`Delete save in Slot ${slotNum}?`)) {
                    localStorage.removeItem(`aureliaGameState_${slotNum}`);
                    document.body.removeChild(modal);
                    showSaveModal(quitAfter);
                }
            });
        });
        modal.querySelectorAll('.save-slot').forEach(slot => {
            slot.addEventListener('click', () => {
                const slotNum = slot.getAttribute('data-slot');
                gameState.saveDate = new Date().toISOString();
                localStorage.setItem(`aureliaGameState_${slotNum}`, JSON.stringify(gameState));
                document.body.removeChild(modal);
                
                if (quitAfter) {
                    loadingScreen.classList.remove('hidden');
                    openingForm.classList.add('hidden');
                    dialogueScene.classList.add('hidden');
                    woodsScene.classList.add('hidden');
                    caveScene.classList.add('hidden');
                    
                    alert('Game saved! Returning to start screen.');
                } else {
                    alert(`Game saved to Slot ${slotNum}!`);
                }
            });
        });

        modal.querySelector('.cancel').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }

    // Show load slots modal
    function showLoadSlotsModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        
        let slotsHTML = '<div class="menu-modal-box"><h2>Load Game</h2><div class="save-slots-container">';
        
        for (let i = 1; i <= 10; i++) {
            const savedData = localStorage.getItem(`aureliaGameState_${i}`);
            if (savedData) {
                const data = JSON.parse(savedData);
                slotsHTML += `
                    <div class="save-slot" data-slot="${i}">
                        <div class="save-slot-header">
                            <span class="save-slot-number">Slot ${i}</span>
                            <span class="save-slot-date">${new Date(data.saveDate).toLocaleString()}</span>
                            <button class="delete-save-btn" data-slot="${i}" onclick="event.stopPropagation()">🗑️</button>
                        </div>
                        <div class="save-slot-info">Player: ${data.playerName}</div>
                    </div>
                `;
            } else {
                slotsHTML += `
                    <div class="save-slot empty" data-slot="${i}">
                        <div class="save-slot-header">
                            <span class="save-slot-number">Slot ${i}</span>
                        </div>
                        <div class="save-slot-info">Empty Slot</div>
                    </div>
                `;
            }
        }
        
        slotsHTML += '</div><button class="menu-option-btn cancel">Cancel</button></div>';
        modal.innerHTML = slotsHTML;
        document.body.appendChild(modal);


        // Add delete button listeners
        modal.querySelectorAll('.delete-save-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const slotNum = btn.getAttribute('data-slot');
                if (confirm(`Delete save in Slot ${slotNum}?`)) {
                    localStorage.removeItem(`aureliaGameState_${slotNum}`);
                    document.body.removeChild(modal);
                    showLoadSlotsModal();
                }
            });
        });
        modal.querySelectorAll('.save-slot:not(.empty)').forEach(slot => {
            slot.addEventListener('click', () => {
                const slotNum = slot.getAttribute('data-slot');
                const savedGame = localStorage.getItem(`aureliaGameState_${slotNum}`);
                if (savedGame) {
                    const saved = JSON.parse(savedGame);
                    Object.assign(gameState, saved);
                    
                    document.body.removeChild(modal);
                    
                    loadingScreen.classList.add('hidden');
                    openingForm.classList.add('hidden');
                    dialogueScene.classList.add('hidden');
                    woodsScene.classList.add('hidden');
                    caveScene.classList.add('hidden');
                    
                    if (gameState.currentScene === 'woods') {
                        woodsScene.classList.remove('hidden');
                        
                        if (gameState.responses.caveQuestion === 'rude') {
                            woodsNpcImage.src = '/assets/taliaquestioning.png';
                        } else {
                            woodsNpcImage.src = '/assets/talianeutral.png';
                        }
                        
                        typeWriter(woodsDialogueText, `Welcome back, ${gameState.playerName}! Continuing from your saved game...`, 30);
                    } else if (gameState.currentScene === 'cave') {
                        caveScene.classList.remove('hidden');
                        typeWriter(caveDialogueText, `Welcome back, ${gameState.playerName}! Continuing from the cave...`, 30).then(() => {
                            setTimeout(() => exploreCave(), 1000);
                        });
                    } else {
                        woodsScene.classList.remove('hidden');
                        typeWriter(woodsDialogueText, `Welcome back, ${gameState.playerName}!`, 30);
                    }
                    
                    updateInventoryDisplay();
                    updateRelationshipHearts('talia', gameState.relationships.talia);
                }
            });
        });

        modal.querySelector('.cancel').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
    }

    // Menu buttons
    menuBtn.addEventListener('click', () => {
        showMenuModal();
    });

    caveMenuBtn.addEventListener('click', () => {
        showMenuModal();
    });

    caveInventoryBtn.addEventListener('click', () => {
        inventoryPanel.classList.toggle('hidden');
        relationshipsPanel.classList.add('hidden');
    });

    caveRelationshipsBtn.addEventListener('click', () => {
        relationshipsPanel.classList.toggle('hidden');
        inventoryPanel.classList.add('hidden');
    });

    inventoryBtn.addEventListener('click', () => {
        inventoryPanel.classList.toggle('hidden');
        relationshipsPanel.classList.add('hidden');
    });

    relationshipsBtn.addEventListener('click', () => {
        relationshipsPanel.classList.toggle('hidden');
        inventoryPanel.classList.add('hidden');
    });

    closeInventoryBtn.addEventListener('click', () => {
        inventoryPanel.classList.add('hidden');
    });

    closeRelationshipsBtn.addEventListener('click', () => {
        relationshipsPanel.classList.add('hidden');
    });


    // Travel scene buttons
    travelMenuBtn.addEventListener('click', () => {
        showMenuModal();
    });

    travelInventoryBtn.addEventListener('click', () => {
        inventoryPanel.classList.toggle('hidden');
        relationshipsPanel.classList.add('hidden');
    });

    travelRelationshipsBtn.addEventListener('click', () => {
        relationshipsPanel.classList.toggle('hidden');
        inventoryPanel.classList.add('hidden');
    });

    // Start game on any key
    document.addEventListener('keydown', () => {
        startText.classList.add('glow');
        if (gameState.currentScene !== 'loading') return;
        startBackgroundMusic(); // Start music on user interaction
        gameState.currentScene = 'opening';
        
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            openingForm.classList.remove('hidden');
            
            const promptMessage = "Oh, good, you're awake. Tell me, do you remember anything about yourself? A name, perhaps?";
            typeWriter(promptText, promptMessage, 30);
        }, 300);
    }, );

    // Also start on click
    document.addEventListener('click', () => {
        if (gameState.currentScene === 'loading') {
            gameState.currentScene = 'opening';
            startBackgroundMusic();
            startText.classList.add('glow');
            
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                openingForm.classList.remove('hidden');
                
                const promptMessage = "Oh, good, you're awake. Tell me, do you remember anything about yourself? A name, perhaps?";
                typeWriter(promptText, promptMessage, 30);
            }, 300);
        }
    }, { once: true });

    submitNameBtn.addEventListener('click', () => {
        const name = playerNameInput.value.trim();

        openingForm.classList.add('hidden');
        dialogueScene.classList.remove('hidden');

        if (name) {
            gameState.playerName = name;
            npcImage.src = '/assets/talianeutral.png';
            typeWriter(dialogueText, `Welcome to Aurelia, ${name}! We have a long journey ahead.`, 30).then(() => {
                setTimeout(() => {
                    dialogueScene.classList.add('hidden');
                    woodsScene.classList.remove('hidden');
                    gameState.currentScene = 'woods';
                    startWoodsScene();
                }, 2000);
            });
        } else {
            npcImage.src = '/assets/taliaquestioning.png';
            const amnesiaText = `You don't remember? Sounds like amnestic syndrome, which refers to the loss of memories, including facts, information and experiences. Honestly, it's hard for me to continue certain aspects of my bedside manner unless I have a name. Can I call you Ted for now?`;
            
            typeWriter(dialogueText, amnesiaText, 30).then(() => {
                optionsDiv.innerHTML = `
                    <button class="option">OK</button>
                    <button class="option">No</button>
                `;

                document.querySelectorAll('.option').forEach(btn => {
                    btn.addEventListener('click', () => {
                        if (btn.textContent === 'OK') {
                            gameState.playerName = 'Ted';
                            npcImage.src = '/assets/talianeutral.png';
                            optionsDiv.innerHTML = '';
                            typeWriter(dialogueText, `Welcome to Aurelia, Ted! We have a long journey ahead.`, 30).then(() => {
                                setTimeout(() => {
                                    dialogueScene.classList.add('hidden');
                                    woodsScene.classList.remove('hidden');
                                    gameState.currentScene = 'woods';
                                    startWoodsScene();
                                }, 2000);
                            });
                        } else {
                            dialogueText.textContent = `What should I call you?`;
                            optionsDiv.innerHTML = '';
                            typeWriter(dialogueText, `What should I call you?`, 30).then(() => {
                                openingForm.classList.remove('hidden');
                                dialogueScene.classList.add('hidden');
                            });
                        }
                    });
                });
            });
        }
    });

    function startWoodsScene() {
        const woodsDialogue = "I'm sure you have a lot of questions. Let's get started. I found you here at the mouth of this cave in the middle of the woods. Weird, huh? What do you think you were doing in there?";
        
        typeWriter(woodsDialogueText, woodsDialogue, 30).then(() => {
            showInitialOptions();
            positionOptionsUnderDialogue();
        });
    }

    function positionOptionsUnderDialogue() {
        const dialogueBox = document.querySelector('.dialogue-box');
        const optionsContainer = document.getElementById('woods-options');
        
        if (dialogueBox && optionsContainer) {
            const dialogueRect = dialogueBox.getBoundingClientRect();
            const dialogueBottom = dialogueRect.bottom;
            optionsContainer.style.top = (dialogueBottom + 15) + 'px';
            optionsContainer.style.transform = 'translateX(-50%)';
        }
    }

    function showInitialOptions() {
        woodsOptions.innerHTML = `
            <button class="woods-option" data-response="exploring">Maybe I was exploring?</button>
            <button class="woods-option" data-response="dontRemember">Why are you asking me? I don't remember anything.</button>
        `;

        document.querySelectorAll('.woods-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const response = btn.getAttribute('data-response');
                gameState.responses.caveQuestion = response;
                woodsOptions.innerHTML = '';
                handleInitialResponse(response);
            });
        });
    }

    function handleInitialResponse(response) {
        let taliaResponse = '';
        
        if (response === 'exploring') {
            taliaResponse = "That could be. When I found you, you didn't have any possessions on yourself. It's sad to think you risked your life inside that cave with nothing to show for it.";
        } else if (response === 'dontRemember') {
            woodsNpcImage.src = '/assets/taliaquestioning.png';
            taliaResponse = "You don't remember anything at all? Sounds like amnestic syndrome, which refers to the loss of memories, including facts, information and experiences.";
        }

        typeWriter(woodsDialogueText, taliaResponse, 30).then(() => {
            showSecondOptions(response);
            positionOptionsUnderDialogue();
        });
    }

    function showSecondOptions(firstResponse) {
        if (firstResponse === 'exploring') {
            woodsOptions.innerHTML = `
                <button class="woods-option" data-response="whatAreYouDoing">What are you doing wandering around in the woods, anyway?</button>
                <button class="woods-option" data-response="investigate">Perhaps I should go back into the cave and investigate. Maybe I left some possessions there.</button>
            `;
        } else if (firstResponse === 'dontRemember') {
            woodsOptions.innerHTML = `
                <button class="woods-option" data-response="goBackCave">If you said you found me at the mouth of the cave, I want to go back in there to see if I left anything behind.</button>
                <button class="woods-option" data-response="tellMeWhy">Tell me why you're here.</button>
            `;
        }

        document.querySelectorAll('.woods-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const response = btn.getAttribute('data-response');
                gameState.responses.secondQuestion = response;
                woodsOptions.innerHTML = '';
                handleSecondResponse(response);
            });
        });
    }

    function handleSecondResponse(response) {
        let taliaResponse = '';

        if (response === 'whatAreYouDoing') {
            taliaResponse = "I'm a healer at the King's Castle. I often come out here for some peace and quiet, or just to collect some ingredients for my salves and potions. Would you like to help me collect some now, before we head back to the castle?";
            typeWriter(woodsDialogueText, taliaResponse, 30).then(() => {
                showYesNoOptions('collect');
            });
        } else if (response === 'tellMeWhy') {
            taliaResponse = "I'm a healer at the King's Castle. I often come out here for some peace and quiet, or just to collect some ingredients for my salves and potions. Come on, we can't waste any more time. We have to get you checked at the castle to make sure you don't have any lasting injuries.";
            typeWriter(woodsDialogueText, taliaResponse, 30).then(() => {
                setTimeout(() => {
                    gameState.currentScene = 'travel';
                    console.log('Going to Travel Scene');
                    woodsScene.classList.add('hidden'); travelScene.classList.remove('hidden'); startTravelScene();
                }, 2000);
            });
        } else if (response === 'goBackCave') {
            woodsNpcImage.src = '/assets/taliaquestioning.png';
            taliaResponse = "You're free to go back to that damp and dusty cave, if you wish. I will be awaiting your return to ensure you are unharmed.";
            typeWriter(woodsDialogueText, taliaResponse, 30).then(() => {
                setTimeout(() => {
                    woodsOptions.innerHTML = `
                        <button class="woods-option-btn">Yes, explore the cave</button>
                        <button class="woods-option-btn">No, not yet</button>
                    `;
                    
                    const buttons = woodsOptions.querySelectorAll('.woods-option-btn');
                    buttons[0].addEventListener('click', () => {
                        console.log('Player chose YES to explore cave');
                        gameState.currentScene = 'cave';
                        woodsScene.classList.add('hidden');
                        caveScene.classList.remove('hidden');
                        woodsOptions.innerHTML = '';
                        startCaveScene();
                    });
                    
                    buttons[1].addEventListener('click', () => {
                        console.log('Player chose NO to explore cave');
                        woodsOptions.innerHTML = '';
                        gameState.currentScene = 'travel';
                        alert('Travel scene coming soon...');
                    });
                }, 1000);
            });
        } else if (response === 'investigate') {
            taliaResponse = "If you wish. I'll wait here for you if that's what you decide to do.";
            typeWriter(woodsDialogueText, taliaResponse, 30).then(() => {
                setTimeout(() => {
                    woodsOptions.innerHTML = `
                        <button class="woods-option-btn">Yes, explore the cave</button>
                        <button class="woods-option-btn">No, not yet</button>
                    `;
                    
                    const buttons = woodsOptions.querySelectorAll('.woods-option-btn');
                    buttons[0].addEventListener('click', () => {
                        console.log('Player chose YES to investigate cave');
                        gameState.currentScene = 'cave';
                        woodsScene.classList.add('hidden');
                        caveScene.classList.remove('hidden');
                        woodsOptions.innerHTML = '';
                        startCaveScene();
                    });
                    
                    buttons[1].addEventListener('click', () => {
                        console.log('Player chose NO to investigate cave');
                        woodsOptions.innerHTML = '';
                        gameState.currentScene = 'travel';
                        alert('Travel scene coming soon...');
                    });
                }, 1000);
            });
        }
    }

    function showYesNoOptions(context) {
        if (context === 'collect') {
            woodsOptions.innerHTML = `
                <button class="woods-option" data-response="yes-collect">Yes</button>
                <button class="woods-option" data-response="no-collect">No</button>
            `;
            
            document.querySelectorAll('.woods-option').forEach(btn => {
                btn.addEventListener('click', () => {
                    const response = btn.getAttribute('data-response');
                    woodsOptions.innerHTML = '';
                    handleCollectionResponse(response);
                });
            });
            
            positionOptionsUnderDialogue();
        }
    }

    // Get random gem item (Uncommon items only)
    function getRandomGem() {
        const gems = caveLootTable.filter(item => item.rarity === 'Uncommon');
        const randomIndex = Math.floor(Math.random() * gems.length);
        return gems[randomIndex];
    }

    // Start Collection Scene
    function startCollectionScene() {
        console.log('Collection scene started');
        woodsScene.classList.remove('hidden');
        woodsNpcImage.src = '/assets/taliahappy.png';
        
        // Hide Talia's name during narration (not dialogue)
        const taliaNameLabel = document.getElementById('woods-npc-name');
        taliaNameLabel.style.display = 'none';
        
        const collectionIntro = "You walk along the wooded path with Talia by your side. The two of you chat about the beautiful scenery in the woods and discuss what materials you hope to find while collecting.";
        
        typeWriter(woodsDialogueText, collectionIntro, 30, true).then(() => {
            setTimeout(() => {
                woodsOptions.innerHTML = `
                    <button class="woods-option-btn">Collect with Talia</button>
                    <button class="woods-option-btn">Collect by yourself</button>
                `;
                
                const buttons = woodsOptions.querySelectorAll('.woods-option-btn');
                
                buttons[0].addEventListener('click', () => {
                    // Collect with Talia - get gem item and increase relationship
                    gameState.relationships.talia += 1;
                    updateRelationshipHearts('talia', gameState.relationships.talia);
                    showHeartNotification('Talia');
                    
                    const gem = getRandomGem();
                    gameState.inventory.push(gem);
                    updateInventoryDisplay();
                    
                    // Delay to show heart notification
                    setTimeout(() => {
                        woodsOptions.innerHTML = '';
                        
                        // Create centered success screen without name label
                        woodsDialogueText.innerHTML = `
                            <p style="color: lime; font-weight: bold; margin-bottom: 20px; font-size: 24px; text-align: center;">Success!</p>
                            <img src="${gem.image}" style="width: 150px; height: 150px; object-fit: contain; display: block; margin: 20px auto; border: 3px solid gold; border-radius: 12px; padding: 8px; background: black; box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);">
                            <p style="margin-top: 20px; text-align: center;">You and Talia found <span class="item-found">${gem.name}</span>!</p>
                            <p style="color: gray; margin-top: 15px; font-size: 18px; text-align: center;">The item has been added to your inventory.</p>
                            <p id="collection-continue" style="visibility: hidden;"></p>
                        `;
                        
                        const collectionContinue = document.getElementById('collection-continue');
                        typeWriter(collectionContinue, "", 1, true).then(() => {
                            // Restore Talia's name for next scene
                            taliaNameLabel.style.display = 'block';
                            gameState.currentScene = 'travel';
                            woodsScene.classList.add('hidden');
                            travelScene.classList.remove('hidden');
                            startTravelScene();
                        });
                    }, 2500);
                });
                
                buttons[1].addEventListener('click', () => {
                    // Collect by yourself - no item
                    woodsOptions.innerHTML = '';
                    const failText = "You searched in vain, abandoning Talia to work on her own as well. Nothing of use was found.";
                    
                    typeWriter(woodsDialogueText, failText, 30, true).then(() => {
                        gameState.currentScene = 'travel';
                        woodsScene.classList.add('hidden');
                        travelScene.classList.remove('hidden');
                        startTravelScene();
                    });
                });
            }, 500);
        });
    }

    // Start Travel Scene
    function startTravelScene() {
        console.log('Travel scene started');
        travelNpcImage.src = '/assets/talianeutral.png';
        
        const travelIntro = "I'll take you back to the King's Castle in Aurelia. After I inspect you again with the other healers, we can try to figure out your identity.";
        
        typeWriter(travelDialogueText, travelIntro, 30, true).then(() => {
            setTimeout(() => {
                // Show options based on whether player came from cave
                if (gameState.cameFromCave) {
                    travelOptions.innerHTML = `
                        <button class="woods-option-btn">A wizard was in the cave I just came from. He told me that I asked him for help earlier. Surely, he must have cursed me, and I lost my memories.</button>
                        <button class="woods-option-btn">Surely I will have some family who will be searching for me.</button>
                    `;
                } else {
                    travelOptions.innerHTML = `
                        <button class="woods-option-btn">Surely I will have some family who will be searching for me.</button>
                    `;
                }
                
                const buttons = travelOptions.querySelectorAll('.woods-option-btn');
                
                buttons.forEach(btn => {
                    btn.addEventListener('click', () => {
                        travelOptions.innerHTML = '';
                        
                        if (btn.textContent.includes('wizard')) {
                            // Wizard option
                            const wizardResponse = "How horrendous indeed! We will notify the castle at once to have this man arrested.";
                            typeWriter(travelDialogueText, wizardResponse, 30, true).then(() => {
                                showBedtimeModal();
                            });
                        } else {
                            // Family option
                            const familyResponse = "I hope so. I don't know how long you were unconscious for. We have a record of all the residents of the city. We will be able to find you, or at least some relatives, soon.";
                            typeWriter(travelDialogueText, familyResponse, 30, true).then(() => {
                                showBedtimeModal();
                            });
                        }
                    });
                });
            }, 500);
        });
    }

    // Show bedtime modal
    function showBedtimeModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-box">
                <p class="modal-question">Go to bed for the night?</p>
                <div class="modal-buttons">
                    <button class="modal-btn yes-btn">Confirm</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelector('.yes-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
            
            // Show saving indicator
            const savingIndicator = document.createElement('div');
            savingIndicator.className = 'saving-indicator';
            savingIndicator.innerHTML = `
                <div class="saving-box">
                    <p style="color: pink; font-size: 36px; font-weight: bold; margin-bottom: 20px;">💾 SAVING...</p>
                    <p style="color: white; font-size: 24px;">Please wait</p>
                </div>
            `;
            document.body.appendChild(savingIndicator);
            
            // Find next available save slot
            let saveSlot = 1;
            for (let i = 1; i <= 10; i++) {
                if (!localStorage.getItem(`aureliaGameState_${i}`)) {
                    saveSlot = i;
                    break;
                }
                if (i === 10) {
                    saveSlot = 10; // Use slot 10 if all are full
                }
            }
            
            // Save game
            gameState.saveDate = new Date().toISOString();
            localStorage.setItem(`aureliaGameState_${saveSlot}`, JSON.stringify(gameState));
            
            // Show success after 1.5 seconds
            setTimeout(() => {
                document.body.removeChild(savingIndicator);
                
                const successIndicator = document.createElement('div');
                successIndicator.className = 'saving-indicator';
                successIndicator.innerHTML = `
                    <div class="saving-box">
                        <p style="color: lime; font-size: 42px; font-weight: bold; margin-bottom: 20px;">✓ SAVED!</p>
                        <p style="color: white; font-size: 24px;">Game saved to Slot ${saveSlot}</p>
                        <p style="color: gray; font-size: 18px; margin-top: 20px;">End of current content</p>
                    </div>
                `;
                document.body.appendChild(successIndicator);
                
                setTimeout(() => {
                    document.body.removeChild(successIndicator);
                }, 3000);
            }, 1500);
        });
    }

    function handleCollectionResponse(response) {
        if (response === 'yes-collect') {
            gameState.relationships.talia += 1;
            updateRelationshipHearts('talia', gameState.relationships.talia);
            
            // Show heart notification
            showHeartNotification('Talia');
            
            gameState.currentScene = 'collection';
            console.log('Going to Collection Scene with Talia');
            console.log('Talia relationship: ' + gameState.relationships.talia + ' hearts');
            
            // Delay the alert so the notification can be seen
            setTimeout(() => {
                startCollectionScene();
            }, 2500);
        } else if (response === 'no-collect') {
            woodsNpcImage.src = '/assets/talianeutral.png';
            const taliaResponse = "Suit yourself. We can head back to the castle, if you wish. That way, I can have my team of healers do a more thorough inspection.";
            typeWriter(woodsDialogueText, taliaResponse, 30).then(() => {
                setTimeout(() => {
                    gameState.currentScene = 'travel';
                    console.log('Going to Travel Scene');
                    woodsScene.classList.add('hidden');
                    travelScene.classList.remove('hidden');
                    startTravelScene();
                }, 2000);
            });
        }
    }
});