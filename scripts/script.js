 // PSEUDOCODE:
 // Check the value of the input field
 // ALERT or provide options for proper spelling etc ("Did you mean: J.K. Rowling")
 // use the value of search as q (parameter) of Goodreads API, to search for that value
 // have to make sure that the results returned are only the ones that have q in the AUTHOR property

// side note: look up puprose of document ready in notes. I'm not so clear on that. Do I need to use it now? A: No don't need to use it now.

// FIRST OF ALL: Let's display the results on the page, with image and ratings
// THEN: Limit to 10 results if there are more than 10

// A NICE TO HAVE: Maybe some way to have an "autocomplete" style thing that gives you the author name possibilities directly from the API

// For the rating stars: https://stackoverflow.com/questions/1987524/turn-a-number-into-star-rating-display-using-jquery-and-css

// Ideas for author options: autcomplete author name?
// or append author name to the container first? So that you have to choose which one?

// FOR NOW:
// STYLE IT
// ADD IN RATING STARS
// PUT IN DISCLAIMER: MAKE SURE TO TYPE BOTH FIRST AND LAST NAME OF AUTHOR IN ORDER TO ENSURE ACCURATE RESULTS
// ADD IN FANCY ANIMATIONS IF NEEDED

const bookApp = {}
bookApp.key = "LOPedocNHgurZFeK9OjKw"

bookApp.getBook = function(query) {
    $.ajax({
    	url: "http://proxy.hackeryou.com",
    	method: "GET",
    	dataType: "json",
    	data: {
    		reqUrl: "https://www.goodreads.com/search/index.xml",
    		params: {
    			key: bookApp.key,
    			q: query
    		},
    		xmlToJSON: true
    	}
    }).then(function(res){
        let searchResults = res.GoodreadsResponse.search.results.work;
        // console.log(searchResults);
        if (searchResults) {
            bookApp.displayResults(searchResults);
        }
    else {
        // put your "search cannot be found" message here
        alert("Sorry, there are no results with that name. Try entering the author's full name.");
    }
    }).fail(function(error) {
        alert("Something went wrong. Please try again.")
    });
};

bookApp.displayResults = function(data) {
    // put search results on the page. But first make sure that whenever you start, the container is clear/empty.
    $("#books").empty();

    let correctAuthors = data.filter(function(author) {
        let singleAuthor = author.best_book.author.name;
        let fixedInput = singleAuthor.toLowerCase().indexOf(bookApp.author.toLowerCase()); 
        // console.log(fixedInput !== -1);       
        return fixedInput !== -1; 
    });

    let sortByRating = correctAuthors.sort(function (a, b) {
        return parseFloat(b.average_rating) - parseFloat(a.average_rating);
    });

    // console.log(correctAuthors);
    
    // Figure this out later... How to put "All books by AUTHOR NAME"
    // console.log(correctAuthors.best_book.author.name);
    // $("#books").append(authorFilt);
  
    correctAuthors.forEach(function(book, index) {
        if (index <= 9) {
            let authorFilt = $("<p>").text(`by ${book.best_book.author.name}`);
            let title = $("<h2>").text(book.best_book.title);
            let rating = $("<p>").text(`Goodreads rating: ${book.average_rating}`);
            // let totalRating = ("<p>").text(book.ratings_count.$t);
            let image = $("<img>").attr("src", book.best_book.image_url); 
            let imageContainer = $("<div>").addClass("imageContainer").append(image);
            let indexNumber = $("<span>").append(index+1);
            let textTest = $("<div>").addClass("textTest").append(title, authorFilt, rating);
            let bookBlock = $("<div>").addClass("bookResult").append(imageContainer, textTest);
            $("#books").append(indexNumber);
            $("#books").append(bookBlock);

        }
    });
};

// ADD STARS LAST. Resort option would be better first.

// What I want to do: Put the image in a different container from the text. So that I can flex the text container to be in a column.
// Maybe try it out in pure html / css first just to see what it's meant to look like. And then try to insert via JS. ONLY IF NEEDED.
// maybe append IMG to the outer #books first. Then append the text in its container next? So do IMG on its own adn then the block with text. But append image first so that it's on the outer edge.

// right. Because you're literally just giving the different p elements etc a class of "result Container"
// But that's not what you want. You want to APPEND THEM / PUT THEM INTO a resultContainer.


// Create a button that changes sort to by worst rating:
// Append it to the right of form.

bookApp.events = function() {
    $("form").on("submit", function(e) {
        e.preventDefault();
        bookApp.author = $("input").val();
        // console.log(author/Query);
        $("input").val("");

        var selectedAuthor = bookApp.author;
        bookApp.getBook(selectedAuthor);
        console.log(selectedAuthor)
        // here, I'm linking the submit to the API query.
    });
    
}


bookApp.init = function(){
    bookApp.events();
    // code to start app goes here
    // bookApp.testAuthor();

};


$(function(){
    bookApp.init();
});
