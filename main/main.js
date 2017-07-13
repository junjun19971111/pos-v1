'use strict';

//=================2min===============
function printReceipt(inputs) {
    var list;
    list = makeList(inputs);
    list = addSubTotal(list);
    var receipt = makeReceipt(list);
    printRec(receipt);
}

//=====================6min===============
function getBarcodeInfo(barcode) {
    var info = {};
    var pos = barcode.indexOf('-');
    if (pos > -1)
    {
        info.barcode = barcode.substring(0, pos);
        info.count = parseFloat(barcode.substring(pos + 1));
    }
    else
    {
        info.barcode = barcode;
        info.count = 1;
    }
    return info;
}

//==========================15min=============
function makeList(barcodeList) {
    var list = [];
    var itemInfoList = loadAllItems();
    for (var barcode of barcodeList)
    {
        var flag = true;
        var barcodeInfo = getBarcodeInfo(barcode);
        for (var item of list)
            if (barcodeInfo.barcode == item.barcode)
            {
                item.count += barcodeInfo.count;
                flag = false;
                break;
            }
        if (flag)
            for (var itemInfo of itemInfoList)
                if (barcodeInfo.barcode == itemInfo.barcode)
                {
                    var item = {};
                    item.name = itemInfo.name;
                    item.barcode = itemInfo.barcode;
                    item.price = itemInfo.price;
                    item.unit = itemInfo.unit;
                    item.count = barcodeInfo.count;
                    list.push(item);
                    break;
                }
    }
    return list;
}

//=====================12min==================
function getPromotion(item) {
    var promotionList = loadPromotions();
    var promo_itemInfo = {}
    promo_itemInfo.price = item.price;
    promo_itemInfo.count = item.count;

    for (var promoInfo of promotionList)
        if (promoInfo.type == 'BUY_TWO_GET_ONE_FREE')
            for (var promoBarcode of promoInfo.barcodes)
                if (promoBarcode == item.barcode)
                {
                    promo_itemInfo.count -= Math.floor(promo_itemInfo.count / 3);
                    break;
                }
    return promo_itemInfo;
}

//=============5min===============
function addSubTotal(list) {
    var promoted_itemInfo;
    for (var item of list)
    {
        promoted_itemInfo = getPromotion(item);
        item.subTotal = (promoted_itemInfo.price * promoted_itemInfo.count);
        item.promo = (item.price * item.count) - (promoted_itemInfo.price * promoted_itemInfo.count);
    }
    return list;
}

//==================10min=============
function makeReceipt(list) {
    var sum = 0, promosum = 0;
    for (var item of list)
    {
        sum = sum + item.subTotal;
        promosum = promosum + item.promo;
    }
    var receipt = {};
    receipt.list = list;
    receipt.total = sum;
    receipt.promoTotal = promosum;
    return receipt;
}

//=======================8min==============
function printRec(receipt) {
    var s = "";
    s = s + "***<没钱赚商店>收据***\n";
    for (var item of receipt.list)
        s = s + "名称：" + item.name + "，数量：" + item.count + item.unit + "，单价：" + item.price.toFixed(2) + "(元)，小计：" + item.subTotal.toFixed(2) + "(元)\n";
    s = s + "----------------------\n总计：" + receipt.total.toFixed(2) + "(元)\n节省：" + receipt.promoTotal.toFixed(2) + "(元)\n**********************";
    console.log(s);
}
