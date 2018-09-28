$(function() {
    function labResultsDelete(form) {
        if (confirm('Are you sure you want to delete these lab results?')) {
            form.submit();
        }
    }
    $('.lab-results-delete-form').on('submit', function(event) {
        event.preventDefault();
        labResultsDelete(this);
    });
});

$(function() {
    function patientDelete(form) {
        if (confirm('Are you sure you want to delete this patient?')) {
            form.submit();
        }
    }
    $('.patient-delete-form').on('submit', function(event) {
        event.preventDefault();
        patientDelete(this);
    });
});

$(function() {
    function clinicDelete(form) {
        if (confirm('Are you sure you want to delete this clinic?')) {
            form.submit();
        }
    }
    $('.clinic-delete-form').on('submit', function(event) {
        event.preventDefault();
        clinicDelete(this);
    });
});

