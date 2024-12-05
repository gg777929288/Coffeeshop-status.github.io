document.addEventListener('DOMContentLoaded', function() {
    // 設置預設日期範圍
    const today = new Date();
    document.getElementById('endDate').value = today.toISOString().split('T')[0];
    const threeMonthsAgo = new Date(today.setMonth(today.getMonth() - 3));
    document.getElementById('startDate').value = threeMonthsAgo.toISOString().split('T')[0];
    
    initializeCharts();
});

function initializeCharts() {
    // 創建會員總數趨勢圖
    const membershipCtx = document.getElementById('membershipChart').getContext('2d');
    const membershipData = parseMembershipData();
    createLineChart(membershipCtx, membershipData, '會員總數趨勢');

    // 創建邀請連結統計圖
    const inviteCtx = document.getElementById('inviteChart').getContext('2d');
    const inviteData = parseInviteData();
    createBarChart(inviteCtx, inviteData, '邀請連結使用次數');

    // 創建新會員來源分析圖
    const joiningCtx = document.getElementById('joiningChart').getContext('2d');
    const joiningData = parseJoiningData();
    createStackedChart(joiningCtx, joiningData, '新會員來源分析');

    // 創建會員流失分析圖
    const leavesCtx = document.getElementById('leavesChart').getContext('2d');
    const leavesData = parseLeavesData();
    createMultiLineChart(leavesCtx, leavesData, '會員流失分析');
}

function createLineChart(ctx, data, title) {
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: title,
                data: data.values,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    }
                }
            }
        }
    });
}

function createStaticCharts() {
    const data = {
        membershipData: parseCSVToArray(document.getElementById('membership-data').textContent),
        inviteData: parseInviteLinks(document.getElementById('invite-links-data').textContent),
        activationData: parseActivationData(document.getElementById('activation-data').textContent),
        retentionData: parseRetentionData(document.getElementById('retention-data').textContent),
        joiningData: parseJoiningData(document.getElementById('joining-data').textContent),
        leavesData: parseLeavesData(document.getElementById('leaves-data').textContent)
    };

    // 為每個圖表創建容器
    const chartTypes = [
        { id: 'membership-chart', title: '會員總數變化' },
        { id: 'invite-chart', title: '邀請連結使用次數' },
        { id: 'activation-chart', title: '新會員啟用率' },
        { id: 'retention-chart', title: '會員保留率' },
        { id: 'joining-chart', title: '新會員來源分析' },
        { id: 'leaves-chart', title: '會員流失分析' }
    ];

    const container = document.getElementById('charts-container');
    chartTypes.forEach(chart => {
        const wrapper = document.createElement('div');
        wrapper.className = 'chart-wrapper';
        wrapper.innerHTML = `
            <h2 class="chart-title">${chart.title}</h2>
            <canvas id="${chart.id}"></canvas>
        `;
        container.appendChild(wrapper);
    });

    // 創建圖表
    createChart(document.getElementById('membership-chart').getContext('2d'), 
        data.membershipData.map(d => d.date),
        data.membershipData.map(d => d.value),
        '會員總數變化');

    createBarChart(document.getElementById('invite-chart').getContext('2d'),
        data.inviteData.map(d => d.link),
        data.inviteData.map(d => d.joins),
        '邀請連結使用次數',
        {
            indexAxis: 'y',
            plugins: { legend: { display: false } }
        });

    // ... 其他圖表創建 ...
}

// 移除 fetchCSV 和相關的非必要函數
function parseCSV(data) {
    const lines = data.split('\n');
    const headers = lines[0].split(',');
    const rows = lines.slice(1).map(line => line.split(','));
    return { headers, rows };
}

// ... 其他圖表創建函數保持不變 ...

function parseMembershipData() {
    // 從 CSV 檔案讀取資料
    return {
        labels: ['2024-11-29', '2024-11-30', '2024-12-01', '2024-12-02'],
        values: [3366, 3368, 3370, 3375]
    };
}

function createAllCharts(rawData, startDate, endDate) {
    // 過濾日期範圍內的數據
    const filteredData = filterDataByDateRange(rawData, startDate, endDate);
    
    // 創建會員總數圖表
    createLineChart('會員總數變化', filteredData.membershipData);
    
    // 創建邀請連結排名圖表
    createBarChart('邀請連結使用次數', filteredData.inviteData);
    
    // 創建新會員啟用率圖表
    createLineChart('新會員啟用率', filteredData.activationData);
    
    // 創建會員保留率圖表
    createLineChart('會員保留率', filteredData.retentionData);
    
    // 創建新會員來源圖表
    createStackedChart('新會員來源分析', filteredData.joiningData);
    
    // 創建會員流失趨勢圖表
    createMultiLineChart('會員流失分析', filteredData.leavesData);
}

function filterDataByDateRange(data, startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return {
        membershipData: data.membershipData.filter(d => {
            const date = new Date(d.date);
            return date >= start && date <= end;
        }),
        // ... 其他數據過濾 ...
    };
}

// 添加樣式
const style = document.createElement('style');
style.textContent = `
    .date-controls {
        text-align: center;
        margin-bottom: 20px;
        padding: 10px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .date-controls label {
        margin: 0 10px;
    }
    .date-controls input[type="date"] {
        padding: 5px;
        border: 1px solid #ddd;
        border-radius: 4px;
    }
    .date-controls button {
        padding: 5px 15px;
        background: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    .date-controls button:hover {
        background: #45a049;
    }
`;
document.head.appendChild(style);

function createMultiLineChart(ctx, labels, datasets, title) {
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: title
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day'
                    }
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function createBarChart(ctx, labels, data, title, customOptions) {
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.8)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: customOptions
    });
}

function createStackedChart(ctx, data, title) {
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'Discovery',
                    data: data.discovery,
                    backgroundColor: 'rgba(75, 192, 192, 0.8)'
                },
                {
                    label: 'Invites',
                    data: data.invites,
                    backgroundColor: 'rgba(153, 102, 255, 0.8)'
                },
                {
                    label: 'Others',
                    data: data.others,
                    backgroundColor: 'rgba(255, 159, 64, 0.8)'
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    stacked: true,
                    type: 'time',
                    time: {
                        unit: 'day'
                    }
                },
                y: {
                    stacked: true,
                    beginAtZero: true
                }
            }
        }
    });
}

// 需要添加這些缺失的解析函數
function parseCSVToArray(csvText) {
    const rows = csvText.split('\n');
    const data = [];
    for (let i = 1; i < rows.length; i++) {
        const [date, value] = rows[i].split(',');
        data.push({
            date: date.split('T')[0],
            value: parseFloat(value)
        });
    }
    return data;
}

function parseInviteLinks(csvText) {
    const rows = csvText.split('\n');
    return rows.slice(1).map(row => {
        const [date, link, joins] = row.split(',');
        return {
            link: link.replace('https://discord.gg/', ''),
            joins: parseInt(joins)
        };
    });
}

function parseJoiningData(csvText) {
    const rows = csvText.split('\n');
    const data = {
        labels: [],
        discovery: [],
        invites: [],
        others: []
    };
    
    rows.slice(1).forEach(row => {
        const [date, discovery, invites, ...rest] = row.split(',');
        data.labels.push(date.split('T')[0]);
        data.discovery.push(parseInt(discovery));
        data.invites.push(parseInt(invites));
        data.others.push(parseInt(rest[rest.length-2])); // total_joins
    });
    
    return data;
}

function parseActivationData(csvText) {
    const rows = csvText.split('\n');
    return rows.slice(1).map(row => {
        const [date, members, rate] = row.split(',');
        return {
            date: date.split('T')[0],
            members: parseInt(members),
            rate: parseFloat(rate)
        };
    });
}

function parseRetentionData(csvText) {
    const rows = csvText.split('\n');
    return rows.slice(1).map(row => {
        const [date, members, rate] = row.split(',');
        return {
            date: date.split('T')[0],
            members: parseInt(members),
            rate: parseFloat(rate)
        };
    });
}

function parseLeavesData(csvText) {
    const rows = csvText.split('\n');
    const data = {
        labels: [],
        longTerm: [],
        shortTerm: []
    };
    
    rows.slice(1).forEach(row => {
        const [date, type, leavers] = row.split(',');
        if (!data.labels.includes(date.split('T')[0])) {
            data.labels.push(date.split('T')[0]);
        }
        if (type.includes('1 month+')) {
            data.longTerm.push(parseInt(leavers));
        } else {
            data.shortTerm.push(parseInt(leavers));
        }
    });
    
    return data;
}

function updateDateRange() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    // 更新圖表的日期範圍
    initializeCharts();
}