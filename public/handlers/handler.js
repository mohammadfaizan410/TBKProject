
$("#nav-toggle").click(function (e) { 
    e.preventDefault();
    if($(".collapsed-nav").hasClass("show-nav"))
     {   $(".collapsed-nav").removeClass("show-nav");
    }
    else {
        $(".collapsed-nav").addClass("show-nav");    }
});