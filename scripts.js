let currentSection = 0;
let lastCenteredHobbieElement = {english: null, japanese: null};
let resizeTimer;

$(document).ready(() => {

  //Slide in greeting text
  $('.slideFromLeft, .slideFromRight, .slideFromTop, .slideFromBottom').css('opacity', '1').css('transform', 'translateX(0)');
  //Show nav buttons
  setTimeout(() => {
    showNavButtons();
  },2000);

  //Attach listeners to nav buttons
  $('.buttonNext').click(() => {changeSection(currentSection + 1)});
  $('.buttonBack').click(() => {changeSection(currentSection - 1)});

  //Attach listeners to hobbies nodes
  $('#hobbiesTextEnglish .hobbiesNode').click((event) => {centerHobbies(event, null, false);});
  $('#hobbiesTextJapanese .hobbiesNode').click((event) => {centerHobbies(event, null, true);});
})

$(window).resize(() => {
  clearTimeout(resizeTimer);
  if(lastCenteredHobbieElement)
    resizeTimer = setTimeout(() => {
      if(lastCenteredHobbieElement.english === null || lastCenteredHobbieElement.japanese === null){
        resetHobbies();
      }else{
        centerHobbies(null, lastCenteredHobbieElement.english, false);
        centerHobbies(null, lastCenteredHobbieElement.japanese, true);
      }
    }, 1000);
})

function toJapanese(){
  $('*').addClass('japanese');

  //Reset hobbies
  resetHobbies();
}

function toEnglish(){
  $('*').removeClass('japanese');
  
  //Reset hobbies
  resetHobbies();
}

function changeNavColor(){
  //Elements to change color
  let selectors = [
    '.buttonMover',
    '.languageChanger p',
    '.navPanel ul li',
    '.navPanel p'
  ]
  //If sections 1 or 4, make nav black, else, white
  currentSection === 1 || currentSection === 4
  ? $(selectors.join(', ')).addClass('blackBar')
  : $(selectors.join(', ')).removeClass('blackBar') ;
}

function showNavButtons(){
  $('.navPanel, .languageChanger').css('visibility', 'visible').css('opacity','1');
  switch(true){
    case currentSection <= 0:
      $('.buttonNext').css('visibility', 'visible');
      $('#buttonNextEnglish').text('enter').css('opacity','1');
      $('#buttonNextJapanese').text('開始').css('opacity','1');
      break;
    case currentSection <= $('section').length - 1:
      $('.buttonNext').css('visibility', 'visible');
      $('#buttonNextEnglish').text('next').css('opacity','1');
      $('#buttonNextJapanese').text('進む').css('opacity','1');
    case currentSection > 0:
      $('.buttonBack').css('visibility', 'visible');
      $('#buttonBackEnglish').text('back').css('opacity','1');
      $('#buttonBackJapanese').text('戻る').css('opacity','1');
      break;
    default:
      $('.buttonMover').css('visibility', 'visible');
      $('.buttonMover').text('error').css('opacity','1');
  }
}

function changeSection(newSection){
  //He protec
  if(newSection < 0 || newSection > $('section').length)
    return;
  
  currentSection = newSection;
  //Fade out nav buttons and nav panels
  $('.buttonMover, .navPanel, .languageChanger').css('opacity', '0');
  //After buttons fade out, disable and move (1 second later)
  setTimeout(() => {
    $('.buttonMover, .navPanel, .languageChanger').css('visibility', 'hidden');
    //Close nav panel if open
    if($('.navPanel').hasClass('open'))
      $('.navPanel').removeClass('open');
    //Change nav color while invisible
    changeNavColor();
    if(newSection <= 0){
      $('#promoshot').removeClass('inAbout');
    }else{
      $('#promoshot').addClass('inAbout');
    }
    $('#page').css('transform', 'translateY(-'+newSection+'00vh');
  },1000);
  //After scroll, fade buttons back in
  setTimeout(() => {
    showNavButtons();
  },2000);

  //Reset hobbies section
  resetHobbies();
}

function toggleMenu(){
  let navPanel = $('.navPanel');
  navPanel.hasClass('open') ? navPanel.removeClass('open') : navPanel.addClass('open');
}

function resetHobbies(){
  hobbiesCloseSecondary('none', true);
  showHobbiesSecondaryNodes('none');
  centerHobbies({currentTarget: document.getElementById('hobbiesTextEnglishCenter')}, null, false);
  centerHobbies({currentTarget: document.getElementById('hobbiesTextJapaneseCenter')}, null, true);
}

function centerHobbies(event, recenterElement, isJapanese){
  //Use #hobbiesTextEnglishCenter as anchor
  //slide #hobbiesSlidingContainer to center on element
  let newCenterVector;
  //Check browser resize
  if(!recenterElement){
    //Get top and left coordinates, then subtract by half size of element to get center
    newCenterVector = {
      x: $(event.currentTarget).offset().left - $(window).scrollLeft() + ($(event.currentTarget).outerWidth() / 2),
      y: $(event.currentTarget).offset().top  - $(window).scrollTop()  + ($(event.currentTarget).outerHeight() / 2)
    }
    //Set new recenter element
    if($(event.currentTarget).hasClass('japanese'))
      lastCenteredHobbieElement.japanese = event.currentTarget;
      else
      lastCenteredHobbieElement.english = event.currentTarget;

  }else{
    newCenterVector = {
      x: $(recenterElement).offset().left - $(window).scrollLeft() + ($(recenterElement).outerWidth() / 2),
      y: $(recenterElement).offset().top  - $(window).scrollTop()  + ($(recenterElement).outerHeight() / 2)
    }
  }
  let hobbiesSlidingContainer = isJapanese ? '#hobbiesSlidingContainerJapanese' : '#hobbiesSlidingContainerEnglish';  
  let centerScreenVector = {
    x: $(hobbiesSlidingContainer).offset().left - $(window).scrollLeft() + ($(hobbiesSlidingContainer).outerWidth() / 2),
    y: $(hobbiesSlidingContainer).offset().top  - $(window).scrollTop()  + ($(hobbiesSlidingContainer).outerHeight() / 2)
  }

  newCenterVector = {
    x: centerScreenVector.x - newCenterVector.x,
    y: centerScreenVector.y - newCenterVector.y
  }
  $(hobbiesSlidingContainer).css('transform',`translate(${newCenterVector.x}px, ${newCenterVector.y}px)`);
}

function showHobbiesSecondaryNodes(section){
  if(section === 'none'){
    hobbiesClose();
    return;
  }
  showHobbiesTertiaryNodes('none');
  hobbiesOpen(section);
}

function hobbiesOpen(section){
  let oppositeSection;
  if(!!section){oppositeSection = section === 'Music' ? 'Games' : 'Music'}
  //Fade out then disable opposite section
  hobbiesFadeOut('#hobbiesMainRow'+oppositeSection+', #hobbiesVerticalLine'+oppositeSection);
  //Grow lines & enable secondary buttons
  $('#hobbiesMainRow'+section+' .hobbiesHorizontalLine').css({'visibility': 'visible', 'width': '20vw', 'opacity':'1'});
  hobbiesFadeIn('#hobbiesMainRow'+section+' .hobbiesSecondaryColumn');
}

function hobbiesClose(section){
  let oppositeSection;
  if(section){oppositeSection = section === 'Music' ? 'Games' : 'Music';}
  else{
    hobbiesCloseSecondary();
    hobbiesClose('Music');
    hobbiesClose('Games');
    return;
  }
  //Enable and fade in opposite section
  hobbiesFadeIn('#hobbiesMainRow'+oppositeSection+', #hobbiesVerticalLine'+oppositeSection);
  //Shrink lines & disable secondary buttons
  $('#hobbiesMainRow'+section+' .hobbiesHorizontalLine').css({'width': '0', 'opacity':'0'});
  hobbiesFadeOut('#hobbiesMainRow'+section+' .hobbiesSecondaryColumn');
}

function hobbiesFadeOut(selectors){
  $(selectors).css({'opacity':'0'});
  setTimeout(() => {$(selectors).css({'visibility':'hidden'});});
}

function hobbiesFadeIn(selectors){
  $(selectors).css({'visibility':'visible', 'opacity':'1'});
}

function showHobbiesTertiaryNodes(section){
  if(section === 'none'){
    hobbiesCloseSecondary();
    return;
  }
  hobbiesOpenSecondary(section);
}

function hobbiesOpenSecondary(section){
  let oppositeSection;
  if(section){
    if(section === 'PC' || section === 'Console'){
      oppositeSection = section === 'PC' ? 'Console' : 'PC';
    }else if(section === 'Rock' || section === 'EDM'){
      oppositeSection = section === 'Rock' ? 'EDM' : 'Rock';
    }else{
      throw new Error('hobbiesOpenSecondary() was run without a valid argument. Check spelling.')
    }      
  }
  //Fade out then disable opposite section
  hobbiesFadeOut('#hobbiesSecondaryColumn'+oppositeSection+', #hobbiesHorizontalLine'+oppositeSection);
  //Grow lines & enable secondary buttons
  $('#hobbiesSecondaryColumn'+section+' .hobbiesVerticalLine').css({'height': '20vh', 'opacity':'1'});
  hobbiesFadeIn('#hobbiesSecondaryColumn'+section+' .hobbiesTertiaryNode');
  setTimeout(() => {$('#hobbiesSecondaryColumn'+section+' .hobbiesTertiaryTextContainer').css('display', 'inherit');}, 1000)
}

function hobbiesCloseSecondary(section, isReset = false){
  let oppositeSection;
  if(section){
    if(section === 'PC' || section === 'Console'){
      oppositeSection = section === 'PC' ? 'Console' : 'PC';
    }else if(section === 'Rock' || section === 'EDM'){
      oppositeSection = section === 'Rock' ? 'EDM' : 'Rock';
    }
  }else{
    hobbiesCloseSecondary('PC', true);
    hobbiesCloseSecondary('Console', true);
    hobbiesCloseSecondary('Rock', true);
    hobbiesCloseSecondary('EDM', true);
    return;
  }
  if(!isReset){
    //Enable and fade in opposite section
    hobbiesFadeIn('#hobbiesSecondaryColumn'+oppositeSection+', #hobbiesHorizontalLine'+oppositeSection);
  }
  //Shrink lines & disable tertiary buttons
  $('#hobbiesSecondaryColumn'+section+' .hobbiesVerticalLine').css({'height': '0', 'opacity':'0'});
  hobbiesFadeOut('#hobbiesSecondaryColumn'+section+' .hobbiesTertiaryNode');
  setTimeout(() => {$('#hobbiesSecondaryColumn'+section+' .hobbiesTertiaryTextContainer').css('display', 'inherit');}, 1000)
}

function sendEmail(language){
  if(canSendEmail(language)){
    $.post('/mailer.php',getFormFields(language))
      .done((data) => {
        console.log('[mailer]',data.success);
      });
  }
}

function canSendEmail(language){
  return formNameFilled(language)
       & formEmailFilled(language)
       & formTelFilled(language)
       & formMessageFilled(language);
}

function formNameFilled(language){
  let result = $('#formName' + language).val().length >= 1;
  if(!result){
    $('#formName' + language).addClass('error');
  }else{
    $('#formName' + language).removeClass('error');
  }
  return result;
}

function formEmailFilled(language){
  let inputValue = $('#formEmail' + language).val();
  if(inputValue.indexOf('@') === -1){
    $('#formEmail' + language).addClass('error');
    return false;
  }
  if(inputValue.split('@')[1].indexOf('.') === -1){
    $('#formEmail' + language).addClass('error');
    return false;
  }
  $('#formEmail' + language).removeClass('error');
  return true;
}

function formTelFilled(language){
  let inputValue = $('#formTel' + language).val();
  if(!inputValue){
    $('#formTel' + language).addClass('error');
    return false;
  }
  let result = inputValue.replace(/[^0-9\uFF10-\uFF19]/g, '').length >= 7;
  if(!result){
    $('#formTel' + language).addClass('error');
  }else{
    $('#formTel' + language).removeClass('error');
  }
  return result;
}

function formMessageFilled(language){
  let result = $('#formMessage' + language).val().length >= 5;
  if(!result){
    $('#formMessage' + language).addClass('error');
  }else{
    $('#formMessage' + language).removeClass('error');
  }
  return result;
}

function getFormFields(language){
  return {
    inputName:    $('#formName'   + language).val(),
    inputEmail:   $('#formEmail'  + language).val(),
    inputTel:     $('#formTel'    + language).val(),
    inputMessage: $('#formMessage'+ language).val()
  }
}