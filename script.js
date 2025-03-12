/**
 * script.js - 处理用户界面交互和显示生成的中文名
 * 
 * 这个文件负责处理用户输入、按钮点击事件，以及在页面上显示生成的中文名字结果。
 * 它与api.js中定义的API调用函数协同工作。
 */

// 在DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取页面元素
    const englishNameInput = document.getElementById('english-name');
    const generateButton = document.getElementById('generate-btn');
    const loadingElement = document.getElementById('loading');
    const resultsSection = document.getElementById('results-section');
    const namesContainer = document.getElementById('names-container');
    const nameCardTemplate = document.getElementById('name-card-template');
    
    // 为生成按钮添加点击事件监听器
    generateButton.addEventListener('click', handleGenerateClick);
    
    // 为输入框添加回车键监听
    englishNameInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            handleGenerateClick();
        }
    });
    
    /**
     * 处理"生成"按钮点击事件
     */
    async function handleGenerateClick() {
        const englishName = englishNameInput.value.trim();
        
        // 验证输入
        if (!englishName) {
            showError('请输入您的英文名');
            return;
        }
        
        // 显示加载状态
        setLoadingState(true);
        
        try {
            // 调用API生成中文名
            const names = await window.ChineseNameAPI.generateChineseNames(englishName);
            
            // 显示结果
            displayResults(names);
        } catch (error) {
            // 显示错误信息
            showError(`生成失败: ${error.message}`);
        } finally {
            // 隐藏加载状态
            setLoadingState(false);
        }
    }
    
    /**
     * 设置加载状态
     * @param {boolean} isLoading - 是否处于加载状态
     */
    function setLoadingState(isLoading) {
        if (isLoading) {
            // 禁用按钮和输入框，显示加载动画
            generateButton.disabled = true;
            englishNameInput.disabled = true;
            loadingElement.style.display = 'flex';
            resultsSection.style.display = 'none';
        } else {
            // 恢复按钮和输入框，隐藏加载动画
            generateButton.disabled = false;
            englishNameInput.disabled = false;
            loadingElement.style.display = 'none';
        }
    }
    
    /**
     * 显示生成的中文名结果
     * @param {Array} names - 生成的中文名数组
     */
    function displayResults(names) {
        // 清空之前的结果
        namesContainer.innerHTML = '';
        
        if (!names || names.length === 0) {
            showError('未能生成有效的中文名');
            return;
        }
        
        // 遍历每个名字，创建结果卡片
        names.forEach(nameData => {
            // 使用模板创建新卡片
            const nameCard = document.importNode(nameCardTemplate.content, true);
            
            // 填充卡片内容
            nameCard.querySelector('.chinese-name').textContent = nameData.chinese_name;
            nameCard.querySelector('.pinyin').textContent = nameData.pinyin;
            nameCard.querySelector('.chinese-meaning').textContent = nameData.chinese_meaning;
            nameCard.querySelector('.english-meaning').textContent = nameData.english_meaning;
            nameCard.querySelector('.culture').textContent = nameData.cultural_background;
            
            // 添加到容器
            namesContainer.appendChild(nameCard);
        });
        
        // 显示结果区域
        resultsSection.style.display = 'block';
        
        // 平滑滚动到结果区域
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    /**
     * 显示错误信息
     * @param {string} message - 错误消息
     */
    function showError(message) {
        // 创建错误提示
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            background-color: #ffeeee;
            color: #e60012;
            padding: 15px;
            border-radius: 5px;
            text-align: center;
            margin: 15px auto;
            max-width: 600px;
            border-left: 4px solid #e60012;
        `;
        
        // 添加到页面
        const inputContainer = document.querySelector('.input-container');
        
        // 移除之前的错误信息
        const oldError = document.querySelector('.error-message');
        if (oldError) {
            oldError.remove();
        }
        
        // 插入新的错误信息
        inputContainer.appendChild(errorElement);
        
        // 3秒后自动移除错误信息
        setTimeout(() => {
            errorElement.style.opacity = '0';
            errorElement.style.transition = 'opacity 0.5s';
            
            setTimeout(() => {
                errorElement.remove();
            }, 500);
        }, 3000);
    }
    
    /**
     * 初始化页面
     */
    function init() {
        // 聚焦到输入框
        englishNameInput.focus();
        
        // 隐藏结果区域
        resultsSection.style.display = 'none';
    }
    
    // 初始化页面
    init();
});
