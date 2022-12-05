
$(document).scroll(function() { 
    if($(window).scrollTop() === 0) {
      $(".navbar").attr("id", "unScrolled");
    }
    else {
        $(".navbar").attr("id", "scrolled");
    }
 });
