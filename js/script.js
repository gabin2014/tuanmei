// 用户行为模拟器脚本
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const generateBtn = document.getElementById('generateBtn');
    const timelineContainer = document.getElementById('timelineContainer');
    const timeline = document.getElementById('timeline');
    
    // 用户信息元素
    const userNameEl = document.getElementById('userName');
    const userGenderEl = document.getElementById('userGender');
    const userAgeEl = document.getElementById('userAge');
    const userPersonaEl = document.getElementById('userPersona');
    const userAvatarEl = document.getElementById('userAvatar');
    
    // 用户名称列表（昵称）
    const userNames = ['小确幸', '陽光燦爛', '蔚藍晴空', '安静角落', '微风拂面', '城市浪人', '追梦人', '星辰大海', '月影疏桐', '时光倒流', '温柔岁月', '纸短情长', '清风徐来', '山水之间', '流年似锦', '阳光明媚', '微笑向暖', '温暖如初', '欢颜', '清风徐来'];
    
    // 用户画像列表
    const userPersonas = ['都市白领', '都市蓝领', '都市银发', '都市中产', '精致妈妈', '普通大众', '未成年人', '小镇青年', '小镇中老年', '在校学生'];
    
    // 用户头像URL（使用随机生成的头像）
    const avatarBaseUrl = 'https://randomuser.me/api/portraits/';
    
    // 商店名称列表
    const shopNames = ['郑远元徐汇店', '郑远元修脚店', '休闲放松会所', '御足堂', '乐福养生', '康逸足疗', '舒心按摩', '健足轩'];
    
    // 商品名称列表
    const productNames = ['69.9元香醋套餐', '99元精油全身按摩', '129元足疗套餐', '159元SPA体验', '79元经络疏通', '199元VIP套餐', '109元肩颈放松', '88元足浴套餐'];
    
    // 企微名称列表
    const workWxNames = ['休闲玩乐福利官-利利', '休闲玩乐福利官-欢欢', '美团销售专员-明明', '美团店铺经理-华华', '美团活动策划-贝贝', '点评活动运营-乐乐'];
    
    // 群聊名称列表
    const groupNames = ['上海足疗福利103群', '徐汇休闲放松群', '美团养生优惠群', '周末休闲玩乐群', '上海养生爱好者', '实惠福利分享群'];
    
    // 活动名称列表
    const activityNames = ['春节裂变活动', '五一促销活动', '夏日清凉特惠', '开业周年庆', '会员专享活动', '双十一狂欢', '感恩回馈季'];
    
    // 奖励列表
    const rewardNames = ['满10减2优惠券', '88元代金券', '免费足疗体验券', '买一送一优惠券', 'VIP会员折扣', '精油赠品券'];
    
    // 行为类型及其数据模型
    const behaviorTypes = {
        potentialTrade: [
            {
                name: '用户到店',
                source: '全景平台',
                template: '{time} 用户[{user}]进入[{shop}]停留{duration}分钟且未在美团下单'
            },
            {
                name: '用户浏览店铺',
                source: '全景平台',
                template: '{time} 用户[{user}]浏览[{shop}]店铺页面，停留{duration}分钟后查看了{count}条评论'
            },
            {
                name: '用户浏览商品',
                source: '全景平台',
                template: '{time} 用户[{user}]浏览[{shop}]店铺页面下的[{product}]商品页面，停留{duration}分钟后离开'
            },
            {
                name: '用户收藏',
                source: '全景平台',
                template: '{time} 用户[{user}]收藏了[{shop}]的[{product}]商品'
            },
            {
                name: '用户搜索',
                source: '全景平台',
                template: '{time} 用户[{user}]在美团APP搜索关键词[{keyword}]，并浏览了搜索结果中的[{shop}]'
            },
            {
                name: '用户下单',
                source: '全景平台',
                template: '{time} 用户[{user}]在美团APP下单购买了[{shop}]的[{product}]，金额{price}元'
            },
            {
                name: '用户领券',
                source: '全景平台',
                template: '{time} 用户[{user}]领取了[{shop}]的[{reward}]'
            },
            {
                name: '用户分享',
                source: '全景平台',
                template: '{time} 用户[{user}]将[{shop}]的[{product}]分享给了好友'
            },
            {
                name: '点赞',
                source: '全景平台',
                template: '{time} 用户[{user}]点赞了[{workWx}]发布的朋友圈内容'
            },
            {
                name: '评论',
                source: '全景平台',
                template: '{time} 用户[{user}]评论了[{workWx}]发布的朋友圈，内容为[很不错的活动，期待参加]'
            }
        ],
        regular: [
            {
                name: '加好友',
                source: '军师SCRM',
                template: '{time} 用户[{user}]添加企微[{workWx}]为好友'
            },
            {
                name: '删除好友',
                source: '军师SCRM',
                template: '{time} 用户[{user}]删除了企微[{workWx}]'
            },
            {
                name: '加入群聊',
                source: '军师SCRM',
                template: '{time} 用户[{user}]加入群聊[{group}]'
            },
            {
                name: '退出群聊',
                source: '军师SCRM',
                template: '{time} 用户[{user}]退出群聊[{group}]'
            },
            {
                name: '添加标签',
                source: '军师SCRM',
                template: '{time} 用户[{user}]被企微[{workWx}]增加标签[足疗老客]'
            },
            {
                name: '1-1发言',
                source: '军师SCRM',
                template: '{time} 用户[{user}]在和[{workWx}]的对话中发言，内容为 [{user}：有优惠券码？] [{workWx}：现在为您发放 #美团小程序/足疗洗浴优惠/9oieo]'
            },
            {
                name: '群内发言',
                source: '军师SCRM',
                template: '{time} 用户[{user}]在群[{group}]中发言，内容为 [{user}：有优惠券码？] [{workWx}：现在为您发放 #美团小程序/足疗洗浴优惠/9oieo]'
            }
        ],
        feedback: [
            {
                name: '参加好友裂变活动',
                source: '军师SCRM',
                template: '{time} 用户[{user}]参加了[{activity}]，成功邀请{count}名有效新客，获得[{reward}]{rewardCount}张'
            },
            {
                name: '参加群裂变活动',
                source: '军师SCRM',
                template: '{time} 用户[{user}]参加了[{activity}]，成功邀请{count}名有效新客，获得[{reward}]{rewardCount}张'
            },
            {
                name: '参加抽奖裂变活动',
                source: '军师SCRM',
                template: '{time} 用户[{user}]参加了[{activity}]抽奖活动，获得[{reward}]{rewardCount}张'
            },
            {
                name: '1-1推送',
                source: '军师SCRM',
                template: '{time} 系统通过[{workWx}]1-1推送对用户[{user}]推送消息 {文本消息：[为您推荐今日特价优惠] 小程序消息：[商品卡片-29194]}，用户在 {responseTime} 浏览了推送商品，并未下单'
            },
            {
                name: '向所在群聊推送',
                source: '军师SCRM',
                template: '{time} 系统通过[{group}]推送对用户[{user}]推送消息 {文本消息：[为您推荐今日特价优惠] 小程序消息：[军师会场卡片]}，用户未打开，并在 {responseTime} 退出了群聊'
            },
            {
                name: '收到了朋友圈',
                source: '军师SCRM',
                template: '{time} 系统通过朋友圈对用户[{user}]发布了消息 {文本消息：[为您推荐今日特价优惠] 图片消息：[点击预览]}，用户未点击'
            }
        ]
    };

    // 关键词列表
    const keywords = ['足疗', '按摩', '足浴', '修脚', '养生', '精油', 'SPA', '放松'];
    
    // 生成随机整数
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    // 生成随机日期时间字符串（过去30天内）
    function getRandomDateTime() {
        const now = new Date();
        const pastDate = new Date(now.getTime() - getRandomInt(1, 30) * 24 * 60 * 60 * 1000 - getRandomInt(0, 23) * 60 * 60 * 1000 - getRandomInt(0, 59) * 60 * 1000);
        
        const year = pastDate.getFullYear();
        const month = String(pastDate.getMonth() + 1).padStart(2, '0');
        const day = String(pastDate.getDate()).padStart(2, '0');
        const hours = String(pastDate.getHours()).padStart(2, '0');
        const minutes = String(pastDate.getMinutes()).padStart(2, '0');
        const seconds = String(pastDate.getSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    
    // 生成响应时间（比原时间晚1-12小时）
    function getResponseTime(originalTime) {
        const original = new Date(originalTime.replace(/【|】/g, ''));
        const response = new Date(original.getTime() + getRandomInt(1, 12) * 60 * 60 * 1000);
        
        const year = response.getFullYear();
        const month = String(response.getMonth() + 1).padStart(2, '0');
        const day = String(response.getDate()).padStart(2, '0');
        const hours = String(response.getHours()).padStart(2, '0');
        const minutes = String(response.getMinutes()).padStart(2, '0');
        const seconds = String(response.getSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    
    // 随机选择数组中的一个元素
    function getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    
    // 填充模板
    function fillTemplate(template, data) {
        let result = template;
        for (const key in data) {
            result = result.replace(new RegExp(`{${key}}`, 'g'), data[key]);
        }
        return result;
    }
    
    // 生成指定用户的随机行为数据
    function generateRandomBehavior(userName) {
        // 随机选择行为类别
        const categories = ['potentialTrade', 'regular', 'feedback'];
        const categoryIndex = getRandomInt(0, 2);
        const category = categories[categoryIndex];
        
        // 从选定类别中随机选择一个行为类型
        const behaviorIndex = getRandomInt(0, behaviorTypes[category].length - 1);
        const behavior = behaviorTypes[category][behaviorIndex];
        
        // 准备填充数据
        const time = getRandomDateTime();
        const data = {
            time: time,
            user: userName, // 使用传入的用户名称
            shop: getRandomElement(shopNames),
            product: getRandomElement(productNames),
            workWx: getRandomElement(workWxNames),
            group: getRandomElement(groupNames),
            activity: getRandomElement(activityNames),
            reward: getRandomElement(rewardNames),
            duration: getRandomInt(1, 30),
            count: getRandomInt(1, 10),
            price: getRandomInt(50, 300),
            rewardCount: getRandomInt(1, 3),
            keyword: getRandomElement(keywords),
            responseTime: getResponseTime(time)
        };
        
        // 填充模板
        const description = fillTemplate(behavior.template, data);
        
        return {
            type: category,
            typeName: category === 'potentialTrade' ? '潜在交易行为' : (category === 'regular' ? '常规行为' : '反馈行为'),
            behaviorName: behavior.name,
            source: behavior.source,
            description: description,
            time: time
        };
    }
    
    // 生成指定用户的多个随机行为
    function generateBehaviors(count, userName) {
        const behaviors = [];
        for (let i = 0; i < count; i++) {
            behaviors.push(generateRandomBehavior(userName));
        }
        // 按时间排序
        return behaviors.sort((a, b) => new Date(b.time.replace(/【|】/g, '')) - new Date(a.time.replace(/【|】/g, '')));
    }
    
    // 创建时间轴项目DOM元素
    function createTimelineItem(behavior) {
        const itemElement = document.createElement('div');
        itemElement.className = `timeline-item behavior-${behavior.type}`;
        itemElement.setAttribute('data-type', behavior.type);
        
        const contentElement = document.createElement('div');
        contentElement.className = `timeline-content behavior-${behavior.type}`;
        
        // 添加时间戳
        const timeElement = document.createElement('span');
        timeElement.className = 'timeline-time';
        timeElement.textContent = behavior.time.replace(/【|】/g, '');
        contentElement.appendChild(timeElement);
        
        // 不添加行为类型标签
        // 根据用户要求移除
        
        // 行为名称已移除，根据用户要求
        
        // 添加行为描述
        const descElement = document.createElement('p');
        // 去掉描述中的时间部分
        let description = behavior.description;
        // 查找时间部分（描述开头的时间戳）
        if (behavior.time && description.startsWith(behavior.time.replace(/【|】/g, ''))) {
            // 移除开头的时间戳及后面的空格
            description = description.substring(behavior.time.replace(/【|】/g, '').length).trim();
        }
        descElement.innerHTML = description
            .replace(/\[([^\]]+)\]/g, (match, p1) => {
                if (userNames.includes(p1)) {
                    return `<span class="user-name">${p1}</span>`;
                } else if (shopNames.includes(p1)) {
                    return `<span class="shop-name">${p1}</span>`;
                } else if (groupNames.includes(p1)) {
                    return `<span class="group-name">${p1}</span>`;
                } else {
                    return `<strong>${p1}</strong>`;
                }
            })
            .replace(/\n\n/g, '<br>');
        contentElement.appendChild(descElement);
        
        // 添加数据来源
        const sourceElement = document.createElement('small');
        sourceElement.className = 'text-muted';
        sourceElement.textContent = `数据来源: ${behavior.source}`;
        contentElement.appendChild(sourceElement);
        
        itemElement.appendChild(contentElement);
        return itemElement;
    }
    
    // 生成随机用户基本信息
    function generateUserInfo() {
        // 随机昵称
        const randomName = getRandomElement(userNames);
        
        // 随机性别
        const gender = Math.random() > 0.5 ? '男' : '女';
        
        // 随机年龄（16-70岁）
        const age = getRandomInt(16, 70);
        
        // 随机用户画像
        const persona = getRandomElement(userPersonas);
        
        // 不再生成头像 URL，因为我们使用固定的动漫头像
        const avatarUrl = '';
            
        return {
            name: randomName,
            gender: gender,
            age: age,
            persona: persona,
            avatar: avatarUrl
        };
    }
    
    // 生成按钮点击事件
    generateBtn.addEventListener('click', function() {
        // 清空当前时间轴
        timeline.innerHTML = '';
        
        // 生成用户基本信息
        const userInfo = generateUserInfo();
        
        // 更新用户信息显示
        userNameEl.textContent = userInfo.name;
        userGenderEl.textContent = userInfo.gender;
        userAgeEl.textContent = userInfo.age;
        userPersonaEl.textContent = userInfo.persona;
        // 保留原有头像
        
        // 生成20-30条与当前用户关联的行为
        const behaviors = generateBehaviors(getRandomInt(20, 30), userInfo.name);
        
        // 创建时间轴项目
        behaviors.forEach((behavior) => {
            const timelineItem = createTimelineItem(behavior);
            timeline.appendChild(timelineItem);
        });
        
        // 显示时间轴容器
        timelineContainer.classList.remove('d-none');
    });
});
