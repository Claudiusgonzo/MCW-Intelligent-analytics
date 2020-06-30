﻿
$(document).ready(function () {

    $("#btnSendSearch").click(function () {
        var searchText = encodeURIComponent($("#searchText").val());
        doSearch(searchText);
    });

    $("#searchText").on("keyup", function (event) {
        if (event.keyCode == 13) {
            $("#btnSendSearch").click();
        }
    });

    function doSearch(searchText) {
      
        $.ajax({
            accepts: "application/json",
            contentType: "application/json; odata.metadata=minimal",
            headers: {
                "api-key": chatSearchApiKey
            },
            dataType: "json",
            type: "GET",
            url: chatSearchApiBase + "/indexes/" + chatSearchApiIndexName + "/docs?api-version=2019-05-06&search=" + searchText,
            success: function (data) {
                var items = [], searchResultsDiv = $("div.search-results");
                var searchResults = JSON.parse(JSON.stringify(data)).value;
                if (searchResults && searchResults.length > 0) {
                    com.contoso.concierge.findUniqueSearchUsers(searchResults);

                    $.each(searchResults, function (key, searchResult) {
                        items.push(createChatEntry(searchResult));
                    });

                    $("div.search-empty").hide();
                    searchResultsDiv.empty();
                    searchResultsDiv.html("<p>Found <strong>" + searchResults.length + "</strong> " + (searchResults.length === 1 ? "result" : "results") + "</p><p>&nbsp;</p>")
                    $("<ul/>", {
                        "class": "chat",
                        html: items.join("")
                    }).appendTo("div.search-results");
                }
                else {
                    searchResultsDiv.empty();
                    $("div.search-empty").show();
                }
            }
        });
    }

    function createChatEntry(searchResult) {
        var chatEntry = "", createDate, initial;
        createDate = new Date(searchResult.createDate);
        initial = searchResult.username.substring(0, searchResult.username.length > 1 ? 2 : 1).toUpperCase();

        chatEntry = '<li class="chatBubbleOtherUser left clearfix"><span class="chat-img pull-left">';
        chatEntry += '<img src="https://placehold.it/50/' + com.contoso.concierge.getAvatarColor(searchResult.username) + '/fff&text=' + initial + '" alt="' + searchResult.username + '" class="img-circle" /></span>';
        chatEntry += '<div class="chat-body clearfix"><div class="header">';
        chatEntry += '<strong class="primary-font">' + searchResult.username + '</strong><small class="pull-right search-time text-muted">';
        chatEntry += '<span class="glyphicon glyphicon-time"></span>&nbsp;' + createDate.toLocaleDateString() + ' ' + createDate.toLocaleTimeString() + '</small></div>';
        chatEntry += '<p>' + searchResult.message + '</p>';
        chatEntry += '</div></li>';

        return chatEntry;
    }

});