$(function() {
    function labResultsDelete(form) {
        if (confirm('Are you sure you want to delete these lab results?')) {
            form.submit();
        }
    }
    $('.lab-results-delete-form').on('submit', function(event) {
        event.preventDefault();
        labResultsDelete(this);
    })
});

