function checkToken()
{
	if(sessionStorage.getItem('jwt')===undefined || sessionStorage.getItem('jwt')===null)
	{
		window.location.href='login.jsp';
	}
	else 
	{
		//fetchRssFeed();
	}
}


function fetchRssFeed() {
    fetch("https://localhost:8443/rss", {
        method: "GET",
        credentials: "include", 
        headers: {
            "Content-Type": "application/xml"
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text(); 
    })
    .then(parseRssFeed)
    .catch(error => console.error("Failed to fetch RSS feed:", error));
}


function parseRssFeed(xmlString) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlString, "application/xml");

    const items = xml.querySelectorAll("item");
    let html = "";

items.forEach(item => {
    const title = item.querySelector("title") ? item.querySelector("title").textContent : "No title";
    const link = item.querySelector("link") ? item.querySelector("link").textContent : "#";
    const description = item.querySelector("description") ? item.querySelector("description").textContent : "No description";

    html += `<div class="rss-item">
                <h2><a href="${link}" target="_blank">${title}</a></h2>
                <p>${description}</p>
             </div>`;
});

    document.getElementById("rssFeedContainer").innerHTML = html;
}


function switchTab(tab) {
	
    if (tab === 'promotions')
       { 
		document.getElementById("addPromotionBtn").style="display:block";
		document.getElementById("addPostBtn").style="display:none";
		
		document.getElementById("postsDiv").style="display:none";
		document.getElementById("promotionsDiv").style="display:block";
		
		document.getElementById("showDivPromotions").style="display:block";
        document.getElementById("showDivPosts").style="display:none";
		
		 document.getElementById("postsDiv").style="display:none";
		document.getElementById("promotionsDiv").style="tabs";
		
		
		document.getElementById("postsCount").style="display:none";
		document.getElementById("promotionsCount").style="display:block";
        }
        else {
			document.getElementById("addPostBtn").style="display:block";
        document.getElementById("addPromotionBtn").style="display:none";
         document.getElementById("showDivPromotions").style="display:none";
        document.getElementById("showDivPosts").style="display:block";
        
        
        document.getElementById("postsDiv").style="tabs";
		document.getElementById("promotionsDiv").style="display:none";
        
        document.getElementById("postsCount").style="display:block";
		document.getElementById("promotionsCount").style="display:none";
           }
           
           
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active-tab');
    });

   	let el = document.getElementById(tab + '-tab');
   	if (el) {
    el.classList.add('active-tab');
	}
}





function search() {
        var input, filter, promotions, posts, promotionItems, postItems, txtValue;
        input = document.getElementById('searchInput');
        filter = input.value.toLowerCase();
        promotions = document.getElementById("promotionsDiv");
        posts = document.getElementById("postsDiv");
        
        promotionItems = promotions.getElementsByClassName('tab-item');
        postItems = posts.getElementsByClassName('tab-item');
        
        let countPromotions=0;
        
        for (var i = 0; i < promotionItems.length; i++) {
            txtValue = promotionItems[i].textContent || promotionItems[i].innerText;
            if (txtValue.toLowerCase().indexOf(filter) > -1) {
                promotionItems[i].style.display = "";
                countPromotions++;
            } else {
                promotionItems[i].style.display = "none";
            }
        }
        document.getElementById("promotionsCount").innerHTML=""+countPromotions;
		let countPosts=0;
		
        for (var i = 0; i < postItems.length; i++) {
            txtValue = postItems[i].textContent || postItems[i].innerText;
            if (txtValue.toLowerCase().indexOf(filter) > -1) {
                postItems[i].style.display = "";
                countPosts++;
            } else {
                postItems[i].style.display = "none";
            }
        }
        document.getElementById("postsCount").innerHTML=""+countPosts;
    }
    
    function logout()
    {		
		sessionStorage.removeItem('jwt');

    	document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
 		window.location.href="logout.jsp";
	}

window.onload=function(){
	let succ=document.getElementById("successMessage");
	let fail=document.getElementById("failMessage");
	
	setTimeout(()=>{
		succ.innerHTML='';
	fail.innerHTML='';
	
	},3000);
}



