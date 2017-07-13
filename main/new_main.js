 'use strict';

//=============将字符串转换为商品对象     15min=====================
function replace(inputs) {
    let all_item = loadAllItems();
    let new_inputs=[];
    let item_list=[];
    let count;
    for(let i=0;i<inputs.length;i++)
    {
       if(inputs[i].length==10)
           new_inputs.push({barcode:inputs[i],count:1});
       else
           new_inputs.push({barcode:inputs[i].split("-")[0],count:inputs[i].split("-")[1]});
    }
    new_inputs=new_inputs.sort();
    for(let i=0;i<new_inputs.length;i++){
        count=0;
        for(var j=i;j<new_inputs.length;j++){
            if(new_inputs[i].barcode == new_inputs[j].barcode)
                count+=parseFloat(new_inputs[i].count);
            else
                break;
        }
        item_list.push({barcode:new_inputs[i].barcode,count:count});
        i=j-1;
    }
    let new_itemlist=[];  //存放新的商品清单（加了count属性）
    for(let i=0;i<item_list.length;i++)
        for(let j=0;j<all_item.length;j++)
            if(item_list[i].barcode==all_item[j].barcode)
            {
                new_itemlist.push(all_item[j]);
                new_itemlist[i].count = item_list[i].count;
            }
    return new_itemlist;
}
//==================计算每种商品实际花费的钱    8min=======================
function actul_total(new_itemlist) {
    let list_promotion=loadPromotions()[0].barcodes;
    for(let i=0;i<new_itemlist.length;i++){
        if(list_promotion.indexOf(new_itemlist[i].barcode)<0 || new_itemlist[i].count<2)
            new_itemlist[i].actultotal=(new_itemlist[i].count*new_itemlist[i].price).toFixed(2);
        else
            new_itemlist[i].actultotal=((new_itemlist[i].count-1)*new_itemlist[i].price).toFixed(2);
    }
    return new_itemlist;
}
//==================计算节省的钱    3min=======================
function save(new_itemlist) {
    let save_money=0;
    for(let i=0;i<new_itemlist.length;i++)
        save_money+=(new_itemlist[i].count*new_itemlist[i].price-new_itemlist[i].actultotal);
    return save_money.toFixed(2);
}
//==================计算总共花费的钱  3min======================
function sum_total(new_itemlist) {
    let sum_money;
    for(let i=0;i<new_itemlist.length;i++)
        sum_money+=new_itemlist[i].actultotal;
    return sum_money.toFixed(2);
}
//==================打印输出   8min=========================
function  print(new_itemlist,sum_money) {
    let str="***<没钱赚商店>收据***/n";
    for(let i=0;i<new_itemlist.length;i++)
        str+="名称：" + new_itemlist[i].name + "，数量：" + new_itemlist[i].count + new_itemlist[i].unit + "，单价：" + new_itemlist.price.toFixed(2) + "(元)，小计：" + new_itemlist[i].actultotal + "(元)\n";
    str += "----------------------\n总计：" + sum_money + "(元)\n节省：" +save(actul_total(printReceipt(inputs))) + "(元)\n**********************";
    return str;
}
//============================================
function printReceipt(inputs) {
    let all_str=print(actul_total(replace(inputs)),sum_total(actul_total(replace(inputs)));
    console.log(all_str);
}
