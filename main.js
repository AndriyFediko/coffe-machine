let slide = 1;
let sliderPos = 0;
let waterNeed = 200;
let milkNeed = 200;
let allCoffesObj = {
    latte: 0,
    americano: 0,
    espresso: 0
};
let favouriteCoffe = "";
waterAmout = 0;
milkAmount = 0;
$(".predictionContainer").hide(0);
if(!localStorage.favouriteCoffe == ""){
    setTimeout( function(){
        $(".predictionContainer").show(300);
        if (localStorage.favouriteCoffe == "Latte") {
            $(".coffePredictionText").text("Maybe you want to order Latte?");
            $(".coffeTypeImage").css("background-image", "url(./img/latteCup.png)");
        } else if (localStorage.favouriteCoffe == "Americano") {
            $(".coffePredictionText").text("Maybe you want to order Americano?");
            $(".coffeTypeImage").css("background-image", "url(./img/americanoCup.png)");
        } else if (localStorage.favouriteCoffe == "Espresso") {
            $(".coffePredictionText").text("Maybe you want to order Espresso?");
            $(".coffeTypeImage").css("background-image", "url(./img/espressoCup.png)");
        }
        let time = 100;
        let interval = setInterval( function(){
            if(time > 0){
                time--;
                $(".loardingLineProgress").css("width", time+"%");
            }else{
                clearInterval(interval);
                $(".predictionContainer").hide(300);
            }

        }, 100);
    }, 2000)
}
function CoffeMachine(power) {
    let intervalID;
    let timerId;
    this.waterAmout = waterAmout;
    this.milkAmount = milkAmount;
    const WATER_HEAT_CATACITY = 4200;
    let getBoilTime = function getBoilTime() {
        let boilTime = waterNeed * WATER_HEAT_CATACITY * 80 / power;
        return boilTime;
    }.bind(this);

    function onReady() {
        clearInterval(intervalID);
        $(".progressBarProgress").css("width", `100%`);
        $(".ProgressInPersents").text(`100%`);
        $(".takeNewOrder").text("Take new order");
        $(".coffeLiquidAnimation").addClass("coffeLiquidAnimation-active");
        setTimeout( function(){$(".steamAnimation").addClass("steamAnimation-active")}, 6000);
        setTimeout( function(){$(".steamAnimation").removeClass("steamAnimation-active")}, 10000);
        setTimeout( function(){$(".coffeLiquidAnimation").removeClass("coffeLiquidAnimation-active")}, 6000);
        $(".time").text("Your coffe is ready");
    }
    this.run = function (waterNeed, milkNeed) {
        if (this.waterAmout >= waterNeed && this.milkAmount >= milkNeed) {
            $(".predictionContainer").hide(300);
            let timeLeft = getBoilTime() / 10;
            let timeGo = 0;
            this.waterAmout -= waterNeed;
            this.milkAmount -= milkNeed;
            $(".takeNewOrder").text("Stop and take new order");
            $(".water").css("height", this.waterAmout / 10 + "%");
            $(".milk").css("height", this.milkAmount / 10 + "%")
            $(".coffeTypeSlider").css("display", "none");
            $(".cookingProgress").css("display", "flex");
            intervalID = setInterval(function () {
                timeGo++;
                timeLeft = getBoilTime() / 10 - timeGo;
                $(".progressBarProgress").css("width", `${(timeGo/(getBoilTime()/10))*100}%`);
                $(".ProgressInPersents").text(`${((timeGo/(getBoilTime()/10))*100).toFixed(0)}%`);
                $(".time").text("Time remain: " + (timeLeft / 100).toFixed(0) + "s")
            }, 10);
            timerId = setTimeout(onReady, getBoilTime());
            if(allCoffesObj.latte > 0 || allCoffesObj.americano || allCoffesObj.espresso){
                if(allCoffesObj.latte > allCoffesObj.americano && allCoffesObj.latte > allCoffesObj.espresso){
                    favouriteCoffe = "Latte";
                } else if(allCoffesObj.americano > allCoffesObj.latte && allCoffesObj.americano > allCoffesObj.espresso){
                    favouriteCoffe = "Americano";
                } else if(allCoffesObj.espresso > allCoffesObj.latte && allCoffesObj.espresso > allCoffesObj.americano){
                    favouriteCoffe = "Espresso";
                } else {
                    favouriteCoffe = "Latte";
                }
                localStorage.favouriteCoffe = favouriteCoffe;
            }
        } else if (this.waterAmout >= waterNeed && this.milkAmount < milkNeed) {
            alert("Недостатньо молока");
        } else if (this.waterAmout < waterNeed && this.milkAmount >= milkNeed) {
            alert("Недостатньо води");
        } else if (this.waterAmout < waterNeed && this.milkAmount < milkNeed) {
            alert("Недостатньо води і молока");
        }
    }
    this.stop = function () {
        clearTimeout(timerId);
        clearInterval(intervalID);
        $(".coffeTypeSlider").css("display", "flex");
        $(".cookingProgress").css("display", "none");
    }
}
let machine = new CoffeMachine(5000);
$(".startCookingBtn").click(function () {
    if (slide == 1) {
        waterNeed = 100;
        milkNeed = 100;
        allCoffesObj.latte++;
    } else if (slide == 2) {
        waterNeed = 200;
        milkNeed = 100;
        allCoffesObj.americano++;
    } else if (slide == 3) {
        waterNeed = 300;
        milkNeed = 0;
        allCoffesObj.espresso++;
    }
    machine.run(waterNeed, milkNeed);
});
$(".btnYes").click( function(){
    if (localStorage.favouriteCoffe == "Latte") {
        waterNeed = 100;
        milkNeed = 100;
        allCoffesObj.latte++;
    } else if (localStorage.favouriteCoffe == "Americano") {
        waterNeed = 200;
        milkNeed = 100;
        allCoffesObj.americano++;
    } else if (localStorage.favouriteCoffe == "Espresso") {
        waterNeed = 300;
        milkNeed = 0;
        allCoffesObj.espresso++;
    }
    machine.run(waterNeed, milkNeed);
});
$(".waterPlusBtn").click(function () {
    if (machine.waterAmout < 1000) {
        machine.waterAmout += 100;
        $(".water").css("height", machine.waterAmout / 10 + "%");
    }
});
$(".milkPlusBtn").click(function () {
    if (machine.milkAmount < 1000) {
        machine.milkAmount += 100;
        $(".milk").css("height", machine.milkAmount / 10 + "%")
    }
});
$(".sliderBtnPrew").click(function () {
    if (slide > 1) {
        sliderPos += 180;
        slide--;
        $(".sliderLine").css("margin-left", sliderPos);
    }
});
$(".slideBtnNext").click(function () {
    if (slide < 3) {
        sliderPos -= 180;
        slide++;
        $(".sliderLine").css("margin-left", sliderPos);
    }
});
$(".takeNewOrder").click( function(){
    machine.stop();
});
$(".close").click( function(){
    $(".predictionContainer").hide(300);
});
