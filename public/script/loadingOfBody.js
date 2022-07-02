function startOfPage() {
    if( document.getElementsByClassName("navBar")[0] ) {
        // {{!-- if( {{loginSucess}} === true )  --}}
            //document.getElementsByClassName("body-overlay-signedin")[0].style.display = "block";
            //document.getElementsByClassName("body-overlay-signedout")[0].style.display = "none";
            document.getElementsByClassName("logout")[0].style.display = "block";
            document.getElementsByClassName("start")[0].style.display = "none";
        
        // {{!-- else {
        //     //document.getElementsByClassName("body-overlay-signedout")[0].style.display = "block";
        //     //document.getElementsByClassName("body-overlay-signedin")[0].style.display = "none";
        //     document.getElementsByClassName("start")[0].style.display = "block";
        //     document.getElementsByClassName("logout")[0].style.display = "none";
        // } --}}
    }
}