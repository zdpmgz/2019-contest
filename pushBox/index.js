function $(selector) { // 将操作DOM的原生方法抽象一下,类似成JQ的$
    return document.querySelector(selector);
}

function $$(selector) { // 将操作id元素DOM原生方法抽象一下
    return document.getElementById(selector);
}

function main() { // 主函数
    initMap(gameData[0]); // 初始化第一关数据

    var select = $('select'); //选中select下拉框
    var stage = '';
    for (var i = 0; i < 15; i++) {
        stage += '<option>第' + (i + 1 )+ '关</option>';
    }

    select.innerHTML = stage;  //填充所有option元素

    select.onchange = function(event) { // 选择关卡的触发事件
        //substring(1,3)是为了当关卡数大于9时，依然可以完整获取关卡数
        initMap(gameData[parseInt(this.value.substring(1, 3)) - 1]);  //初始化选中的关卡
        $('.level').innerHTML = 'level <span>' + (parseInt(this.value.substring(1, 3))) + '</span>';
        this.blur();
    }

    $('button').onclick = function(event) { // 重试按钮，重新初始化关卡
        initMap(gameData[parseInt(select.value.substring(1, 3)) - 1]) 
    }

    keyEvent();
}

function initMap(data) { // 初始关卡数据
    var mapData = '';
    for (var i = 0; i < data.size.height; i++) {
        mapData += '<tr>';
        for (var j = 0; j < data.size.width; j++) {
            mapData += '<td id=' +  i + '_' + j + '></td>';  //给每一个方块加上id（行号_列号）
        }
        mapData += '</tr>';
    }
    $('table').innerHTML = mapData;
    setMapClass(data.map);
}

function setMapClass(data) { // 给每一个格子赋上一个类名
    keys = {
         5: "wall", // 墙
        10: "ground", // 地板
        20: "target", // 目标点
        60: 'man', // 人
        80: "real", // 箱子
    };

    data.forEach(function(e, i) { //e是遍历的数组内容,i是遍历的数组索引
        e.forEach(function(e, j) {           
            $$(i + '_' + j).className = keys[e];      //当前类名
            $$(i + '_' + j).dataset.class = keys[e];  //初始类名
        });
    });
}

function keyEvent() { // 监控键盘事件
    document.onkeydown = function(event) {
        var cur = $('.man').id.split('_');  //把小人的坐标存为数组
        var row = cur[0];   //获取小人的行坐标
        var col = cur[1];   //获取小人的列坐标
        var rows = $('table').rows.length;    //本关卡的总行数
        var cols = $('table').rows[0].cells.length;   //本关卡的总列数
        var direction;  //移动方向
        switch(event.keyCode) {
            case 37: // 左 
                direction = 'l';
                col--;
                if (col < 0 || $$(row + '_' + col).className == 'wall') {
                    return;
                } else if ($$(row + '_' + col).className == 'real' || $$(row + '_' + col).className == 'arrive') {
                    col--;
                    if (col < 0 || $$(row + '_' + col).className == 'wall' || $$(row + '_' + col).className == 'arrive') {
                        return;
                    }
                    col++;
                }
                break;
            case 38: // 上
                direction = 'u';
                row--;
                if (row < 0 || $$(row + '_' + col).className == 'wall') {
                    return;
                } else if ($$(row + '_' + col).className == 'real' || $$(row + '_' + col).className == 'arrive') {
                    row--;
                    if (row < 0 || $$(row + '_' + col).className == 'wall' || $$(row + '_' + col).className == 'arrive') {
                        return;
                    }
                    row++;
                }
                break;
            case 39: // 右
                direction = 'r';
                col++;
                if (col >= cols || $$(row + '_' + col).className == 'wall') {
                    return;
                } else if ($$(row + '_' + col).className == 'real' || $$(row + '_' + col).className == 'arrive') {
                    col++;
                    if (col >= cols || $$(row + '_' + col).className == 'wall' || $$(row + '_' + col).className == 'arrive') {
                        return;
                    }
                    col--;
                }
                break;
            case 40: // 下
                direction = 'd';
                row++;
                if (row >= rows || $$(row + '_' + col).className == 'wall') {
                    return;
                } else if ($$(row + '_' + col).className == 'real' || $$(row + '_' + col).className == 'arrive') {
                    row++;
                    if (row >= rows || $$(row + '_' + col).className == 'wall' || $$(row + '_' + col).className == 'arrive') {
                        return;
                    }
                    row--;
                }
                break;
            default:
                break;
        }
        move(cur, [row, col], direction);
    }
}

function move(cur, next, direction) { // cur当前点 next下一点 direction代表移动方向
    var row = next[0];
    var col = next[1];
    if ($$(cur[0] + '_' + cur[1]).dataset.class == 'target') {
        $$(cur[0] + '_' + cur[1]).className = 'target';
    } else {
        $$(cur[0] + '_' + cur[1]).className = 'ground';
    }
    if ($$(next[0] + '_' + next[1]).className == 'ground' || $$(next[0] + '_' + next[1]).className == 'target') {
        $$(next[0] + '_' + next[1]).className = 'man';
    } else {
        switch(direction) {
            case 'u':
                row--;
                break;
            case 'r':
                col++;
                break;
            case 'd':
                row++;
                break;
            case 'l':
                col--;
                break;
        }
        if ($$(row + '_' + col).className == 'ground') {
            $$(row + '_' + col).className = 'real';
            $$(next[0] + '_' + next[1]).className = 'man';
        } else {
            $$(row + '_' + col).className = 'arrive';
            $$(next[0] + '_' + next[1]).className = 'man';
        }
    }
    setTimeout(function() {
        isWin();
    }, 1000)
}

function isWin() { // 是否过关
    if (!$('.real')) {
        if ($('.level span').innerHTML == '15') {
            alert('恭喜你通关全部关卡，这个游戏已经难不倒你了！');
            isWin = function(){};
        } else {
            alert('恭喜你通关了, 再接再励，攻克下一关');
            var level = parseInt($('.level span').innerHTML);  
            initMap(gameData[level])  //初始化下一关
            $('.level').innerHTML = 'level <span>' + (level + 1) + '</span>';
            $('select').value = '第' + (level + 1) + '关';
        }
    }
}
//调用主函数
main();