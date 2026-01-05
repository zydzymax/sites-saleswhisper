/**
 * Sales Whisper - Main JavaScript
 * ================================
 */

// ============================================
// TODO: Set your bot API URL here
// When you have a real API endpoint, replace null with the URL string
// Example: 'https://api.saleswhisper.pro/chat'
// ============================================
const BOT_API_URL = 'https://saleswhisper.pro/api/chat';

// ============================================
// DOM Ready
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initSmoothScroll();
    initMobileMenu();
    initFAQAccordion();
    initContactForm();
    initChatWidget();
});

// ============================================
// Smooth Scroll
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const mobileMenu = document.querySelector('.mobile-menu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                }
            }
        });
    });
}

// ============================================
// Mobile Menu
// ============================================
function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (toggle && mobileMenu) {
        toggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
}

// ============================================
// FAQ Accordion
// ============================================
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-item__question');

        if (question) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');

                // Close all other items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });

                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
}

// ============================================
// Contact Form
// ============================================
function initContactForm() {
    const form = document.querySelector('.contact__form form');

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Prepare payload for API
            const payload = {
                name: data.name || '',
                contact: data.contact || '',
                message: data.comment || '',
                source: 'website_form',
                niche: data.website || ''
            };

            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Отправка...';
            submitBtn.disabled = true;

            try {
                // Send to API
                const response = await fetch('/api/leads', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    // Hide form, show success message
                    const successMessage = document.querySelector('.form-success');
                    if (successMessage) {
                        form.style.display = 'none';
                        successMessage.classList.add('active');
                    }
                    form.reset();
                } else {
                    throw new Error('Server error');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                alert('Произошла ошибка. Попробуйте позже или напишите в Telegram.');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// ============================================
// Chat Widget
// ============================================

// Chat state
let chatOpen = false;
let chatMessages = [];

function initChatWidget() {
    const chatBtn = document.querySelector('.chat-widget-btn');
    const chatPanel = document.querySelector('.chat-panel');
    const chatClose = document.querySelector('.chat-panel__close');
    const chatInput = document.querySelector('.chat-panel__input input');
    const chatSendBtn = document.querySelector('.chat-panel__input button');
    const messagesContainer = document.querySelector('.chat-panel__messages');

    if (!chatBtn || !chatPanel) return;

    // Toggle chat panel
    chatBtn.addEventListener('click', function() {
        chatOpen = !chatOpen;
        chatPanel.classList.toggle('active', chatOpen);

        if (chatOpen && chatMessages.length === 0) {
            // Add welcome message
            addBotMessage('Привет! Я демо-бот Sales Whisper. Задайте мне вопрос о продукте или расскажите о своём бизнесе.');
        }

        if (chatOpen && chatInput) {
            setTimeout(() => chatInput.focus(), 300);
        }
    });

    // Close button
    if (chatClose) {
        chatClose.addEventListener('click', function() {
            chatOpen = false;
            chatPanel.classList.remove('active');
        });
    }

    // Send message on button click
    if (chatSendBtn) {
        chatSendBtn.addEventListener('click', sendMessage);
    }

    // Send message on Enter
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Send message function
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message
        addUserMessage(message);
        chatInput.value = '';

        // Show typing indicator
        showTypingIndicator();

        // Simulate bot response (or call real API)
        if (BOT_API_URL) {
            // TODO: Implement real API call when BOT_API_URL is set
            fetchBotResponse(message);
        } else {
            // Mock response after delay
            setTimeout(() => {
                hideTypingIndicator();
                addBotMessage(getMockResponse(message));
            }, 1500);
        }
    }

    // Add user message to chat
    function addUserMessage(text) {
        chatMessages.push({ type: 'user', text });
        renderMessages();
    }

    // Add bot message to chat
    function addBotMessage(text) {
        chatMessages.push({ type: 'bot', text });
        renderMessages();
    }

    // Render all messages
    function renderMessages() {
        if (!messagesContainer) return;

        messagesContainer.innerHTML = chatMessages.map(msg => `
            <div class="chat-message chat-message--${msg.type}">
                ${msg.text}
            </div>
        `).join('');

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Show typing indicator
    function showTypingIndicator() {
        if (!messagesContainer) return;

        const typing = document.createElement('div');
        typing.className = 'chat-message chat-message--bot chat-message--typing';
        typing.id = 'typing-indicator';
        typing.innerHTML = '<span></span><span></span><span></span>';
        messagesContainer.appendChild(typing);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Hide typing indicator
    function hideTypingIndicator() {
        const typing = document.getElementById('typing-indicator');
        if (typing) typing.remove();
    }

    // Fetch real bot response (when API is available)
    async function fetchBotResponse(message) {
        try {
            const response = await fetch(BOT_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            const data = await response.json();
            hideTypingIndicator();
            addBotMessage(data.response || data.message || 'Не удалось получить ответ');
        } catch (error) {
            console.error('Chat API error:', error);
            hideTypingIndicator();
            addBotMessage('Произошла ошибка при обращении к боту. Попробуйте позже.');
        }
    }

    // Mock responses for demo
    function getMockResponse(userMessage) {
        const lowerMsg = userMessage.toLowerCase();

        if (lowerMsg.includes('привет') || lowerMsg.includes('здравствуй')) {
            return '[BOT MOCK]: Здравствуйте! Рад вас видеть. Расскажите, какой у вас бизнес и чем я могу помочь?';
        }

        if (lowerMsg.includes('цена') || lowerMsg.includes('стоимость') || lowerMsg.includes('сколько')) {
            return '[BOT MOCK]: Стоимость внедрения ИИ-продавца начинается от 25 000 ₽. Точная цена зависит от сложности сценария и интеграций. Хотите получить персональный расчёт?';
        }

        if (lowerMsg.includes('срок') || lowerMsg.includes('долго') || lowerMsg.includes('быстро')) {
            return '[BOT MOCK]: Базовую настройку можно сделать за 3-5 дней. Более сложные проекты с интеграциями занимают 1-2 недели. Когда вам нужен результат?';
        }

        if (lowerMsg.includes('crm') || lowerMsg.includes('интеграц')) {
            return '[BOT MOCK]: Да, мы интегрируемся с amoCRM, Битрикс24, Google Sheets, Notion и другими системами. Какую CRM вы используете?';
        }

        return '[BOT MOCK]: Спасибо за сообщение! Здесь будет ответ ИИ-продавца. В реальной версии бот проанализирует ваш запрос и даст релевантный ответ.';
    }
}

// ============================================
// Utility Functions
// ============================================

// Format number with thousands separator
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
