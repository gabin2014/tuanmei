/**
 * api.js - 负责处理与DeepSeek-R1 API的通信
 * 
 * 这个文件包含所有与AI API调用相关的函数，包括请求构建和响应处理。
 * 使用了DeepSeek-R1模型生成中文名字及其文化含义。
 */

// API配置信息
const API_CONFIG = {
    // API端点
    endpoint: "https://api.siliconflow.cn/v1/chat/completions",
    // API密钥（注意：在生产环境中应通过更安全的方式存储和获取）
    apiKey: "sk-klriusluifenpbrmvsgvlijhzisvyfhoiuyvxqamlmtqyrcd",
    // 使用的模型
    model: "Pro/deepseek-ai/DeepSeek-R1",
    // 默认生成选项数量
    nameCount: 3
};

/**
 * 生成中文名字的主函数
 * @param {string} englishName - 用户输入的英文名
 * @returns {Promise<Array>} - 包含生成的中文名及其解释的数组
 */
async function generateChineseNames(englishName) {
    try {
        // 检查输入是否有效
        if (!englishName || englishName.trim() === "") {
            throw new Error("请输入有效的英文名");
        }
        
        // 准备请求数据
        const response = await fetchFromAPI(englishName);
        
        // 解析API返回的结果
        const names = parseAPIResponse(response);
        
        return names;
    } catch (error) {
        console.error("生成中文名时出错:", error);
        throw error;
    }
}

/**
 * 调用DeepSeek-R1 API
 * @param {string} englishName - 用户的英文名
 * @returns {Promise<Object>} - API的原始响应
 */
async function fetchFromAPI(englishName) {
    // 构建提示词，要求AI生成结构化的中文名字和解释
    const prompt = `
你是一个专业的中文名字顾问，帮助外国人取既有趣又有文化底蕴的中文名字。
请根据以下英文名"${englishName}"，生成${API_CONFIG.nameCount}个独特的中文名字。

对于每个名字，请遵循以下JSON格式返回：
{
  "names": [
    {
      "chinese_name": "中文名字",
      "pinyin": "汉语拼音",
      "chinese_meaning": "中文详细含义解释",
      "english_meaning": "英文详细含义解释",
      "cultural_background": "相关中国文化背景"
    },
    // 其他名字...
  ]
}

生成名字时，请严格遵循以下要求：
1. 体现中国传统文化特色，可引用古诗词、成语、历史典故等
2. 确保音韵优美，读起来朗朗上口，声调搭配和谐
3. 蕴含吉祥寓意，象征美好品质或祝福
4. 名字应适合实际使用，避免过于生僻的字或奇怪的组合
5. 深入理解英文名的原始含义，创造性地将其转化为中文名
6. 适当加入幽默成分和现代网络梗，但要保持品位不低俗
7. 每个名字都要有独特的风格，不要互相重复

注意事项：
1. 每个名字既要考虑音译（发音相似）也要考虑意译（含义相近）
2. 解释要既有文化深度又要通俗易懂
3. 将英文名的特点巧妙融入中文名中
4. 严格遵守上述JSON格式，不要添加任何额外文本
`;

    try {
        // 构建API请求
        const requestBody = {
            model: API_CONFIG.model,
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 2000
        };

        // 发送请求到API
        const response = await fetch(API_CONFIG.endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_CONFIG.apiKey}`
            },
            body: JSON.stringify(requestBody)
        });

        // 检查响应状态
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API请求失败: ${errorData.error?.message || response.statusText}`);
        }

        // 返回响应数据
        return await response.json();
    } catch (error) {
        console.error("API调用失败:", error);
        throw new Error(`API调用失败: ${error.message}`);
    }
}

/**
 * 解析API响应，提取中文名字及其解释
 * @param {Object} response - API的原始响应
 * @returns {Array} - 格式化后的名字数组
 */
function parseAPIResponse(response) {
    try {
        // 获取API返回的内容
        const content = response.choices[0]?.message?.content;
        
        if (!content) {
            throw new Error("API返回的内容为空");
        }
        
        // 尝试解析JSON内容
        // 首先尝试直接解析整个字符串
        let parsedData;
        try {
            parsedData = JSON.parse(content);
        } catch (e) {
            // 如果直接解析失败，尝试从文本中提取JSON部分
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                parsedData = JSON.parse(jsonMatch[0]);
            } else {
                throw new Error("无法从API响应中提取有效的JSON数据");
            }
        }
        
        // 验证数据结构
        if (!parsedData.names || !Array.isArray(parsedData.names)) {
            throw new Error("API返回的数据格式不符合预期");
        }
        
        return parsedData.names;
    } catch (error) {
        console.error("解析API响应时出错:", error);
        throw new Error(`解析API响应失败: ${error.message}`);
    }
}

// 导出函数供其他模块使用
window.ChineseNameAPI = {
    generateChineseNames
};
