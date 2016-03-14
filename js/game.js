var check = false;
var next = 0;

var clear_interval;
var reload_time = 4500;
var time = 120;

var countQuestion = $('.game').length;

var checkArr = [];

for(var i = 0;i < countQuestion;i++){
  checkArr[i] = 0;
}

for(var i = 0; i < 16;i++){
  $('.none').eq(i)
}

var snd_start = new Audio("sound/QnA_start_sound.mp3");
var snd_bg = new Audio("sound/QnA_background.mp3");
var snd_click = new Audio("sound/button_click.mp3");
var snd_choose_wrong = new Audio("sound/choose_wrong.mp3");
var snd_choose_right = new Audio("sound/QnA_right.mp3");
var snd_open_img = new Audio("sound/QnA_open_image.mp3");
var snd_congrat = new Audio("sound/QnA_congrat.mp3");
var snd_lose = new Audio("sound/fail.mp3");

function play_snd_start(){
  snd_start.pause();
  snd_start.currentTime = 0;
  snd_start.play();
  
  snd_start.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
  }, false);
}

function play_snd_bg(){
  snd_bg.pause();
  snd_bg.currentTime = 0;
  snd_bg.play();
  snd_bg.volume = 0.4;
  
  snd_bg.addEventListener('ended', function() {
      this.currentTime = 0;
      this.play();
  }, false);
}
function stop_snd(name) {
  name.pause();
  name.currentTime = 0;
}
function play_snd(type) {
    if (type == 3) {
        snd_click.pause();
        snd_click.currentTime = 0;
        snd_click.play();
    }
    if (type == 4) {
        snd_choose_right.pause();
        snd_choose_right.currentTime = 0;
        snd_choose_right.play();
    }
    
        if (type == 5) {
        snd_choose_wrong.pause();
        snd_choose_wrong.currentTime = 0;
        snd_choose_wrong.play();
    }
    if (type == 6) {
        snd_open_img.pause();
        snd_open_img.currentTime = 0;
        snd_open_img.play();
    }
    if (type == 7) {
        snd_congrat.pause();
        snd_congrat.currentTime = 0;
        snd_congrat.play();
    }
    if (type == 8) {
        snd_lose.pause();
        snd_lose.currentTime = 0;
        snd_lose.play();
    }
}

function mosaicGrid(selector,target) {
  var cols = [0,0,0,0];
  var allTarget = $(selector).find(target);
  if (0 === allTarget.length) 
    return;
  allTarget.each(function(){
    var pos = minPos(cols);
    var x = pos * 100/cols.length;
    var y = cols[pos];
    $(this).css({left: x + "%", top: y + "px"});
    cols[pos] = cols[pos] + $(this).height();
    $(selector).height(Math.max.apply(null, cols) );    
  });
}
function minPos(arr) {
  var min = Math.min.apply(null, arr);
  for(var i = 0; i < arr.length; i++) {
    if (min === arr[i])
      return i;
  }
}

$(document).ready(function(){
  play_snd_start();
  
  setTimeout(function(){
    $('.btn-start-overlay').hide();
  },1500)
  
  $('.btn-start').click(function(){
    play_snd(3);
    stop_snd(snd_start);
    changePage(1);
    play_snd_bg();
    mosaicGrid('.question-screen','img');
  })
  
  $('.none').click(function(){
    play_snd(3);
    stop_snd(snd_choose_wrong);
    stop_snd(snd_choose_right);
    if ($(this).hasClass('wrong')) {
      return;
    }
    else{
      var questID = $(this).attr('data-quest');
      
      changePage(parseInt(questID)+1);
      
      
      $('.endtime').show();
      $('.logo-white').show();
      $('.right-text').show();
      $('.vegetable_left').show();
      
      countdown();
    }
  })
  
  init_game();
  
  $('.btn-reload').bind('click',function(){
    reload();
  })
  $('.gift').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      winParticle();
      
      setTimeout(function(){
        reload();
      },reload_time)
  });
})

function winParticle() {
  clickSpark.fireParticles($('.gift'));
  
  //clickSpark.setCallback(function(){
  //  winParticle();
  //})
  setTimeout(function(){
    winParticle();
  },500)
}

function changePage(current) {
  $('.page').hide();
  $('.page').eq(current).fadeIn();
}
function checkArray() {
  stop_snd(snd_bg);
  if ($('.done').length >= 10) {
    endGame(1);
  }
  else{
    endGame(2);
  }
  $('.endtime').hide();
  
}

function endGame(type) {
  $(".endtime").hide();
  $('.question-screen').hide();
  if (type == 1) {
    changePage(18);
    play_snd(7);
    
    setTimeout(function(){
      changePage(20);
    },reload_time)
  }
  if (type == 2) {
    changePage(19);
    play_snd(8);
    
    setTimeout(function(){
      reload();
    },reload_time)

  }
}

function countdown() {
  
  $(".endtime p").text(time + "s");
  clear_interval = setInterval(function(){
    time -= 1;
    $(".endtime p").text(time + "s");
    if (time <= 0) {
      clearInterval(clear_interval);
      $('.game').hide();
      $('.btn-next').hide();
      checkArray();
    }
  },1000)
}

function reload() {
  window.location.reload();
}

$('.btn-next').click(function(){
  
  clearInterval(clear_interval);
  $(this).hide();
  $('.endtime').hide();
  $('.right-text').hide();
  $('.logo-white').hide();
  $('.vegetable_left').hide();
  
  changePage(1);
  if (answer_choose == true) {
    play_snd(4);
    checkArr[ans_data] = 1;
    $('.none').eq(ans_data).fadeOut();
    $('.none').eq(ans_data).addClass('done');
  }
  else{
    play_snd(5);
    $('.none').eq(ans_data).addClass('wrong');
    var wrong = $('.wrong').length;
    if (wrong >=6) {
      endGame(2);
    }
    
  }
  
  var done = $('.done').length;
  var wrong = $('.wrong').length;
  var answer_total = done + wrong;
  console.log(answer_total);
  if (answer_total == 16) {
    checkArray();
  }
})


var choose = false;
var answer_choose = false;
var ans_data;
function init_game() {
  $('.ans').click(function(){
    choose = true;
    $('.ans').css({'-webkit-filter':'brightness(1)'});
    $(this).css({'-webkit-filter':'brightness(0.5)'});
    
    play_snd(3);
    
    ans_data = $(this).parents('.answer_box').attr('data');
    
    if ($(this).hasClass('true')) {
      
      answer_choose = true;
      
    }
    else if ($(this).hasClass('false')) {
      answer_choose = false;
    }
    //if (next == countQuestion) {
    //  clearInterval(clear_interval);
    //  
    //  checkArray();
    //}
    if (choose == true) {
      $('.btn-next').fadeIn();
    }
  })
}