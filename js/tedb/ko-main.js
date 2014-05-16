function viewModel() {
    var self = this;
    self.currentPage = {
        type: ko.observable()
    }

    self.dbURI = 'http://ec2-54-227-62-182.compute-1.amazonaws.com/kinomeDBAPI';
    self.dbtarget = new targetModel();
    self.currentTargetAC = ko.observable();
    self.uniprot_href = ko.computed(function() {
        return "http://www.uniprot.org/uniprot/" + self.currentTargetAC();
    });

    self.ajax = function(uri, method, data) {
        var request = {
            url: uri,
            type: method,
            contentType: "application/json",
            accepts: "application/json",
            cache: false,
            dataType: 'json',
            data: JSON.stringify(data),
            error: function(jqXHR) {
                console.log("ajax error " + jqXHR.status);
            }
        };
        return $.ajax(request);
    };

    // Update the target AC URL hash
    self.goToTarget = function (target_ac) { location.hash = target_ac };

    self.currentURL = ko.observable();

    // Client-side routes    
    Sammy(function () {
        this.get('target/:target_ac', function () {
            self.currentPage.type('target');
            self.currentURL('target/' + this.params.target_ac);
            self.currentTargetAC(this.params.target_ac);
            self.ajax(self.dbURI + "/" + self.currentTargetAC(), 'GET').done(function(data) {
                self.dbtarget.updatedata(data);
            });
        });

        this.get('', function () {
            self.currentPage.type('home');
            self.currentURL('');
            self.currentTargetAC(null);
        });

    }).run();

}

var vm = new viewModel();
ko.applyBindings(vm);

// $(document).ready(function() {
//     $('#pdbtable').dataTable({
//         "sPaginationType": "full_numbers"
//     });
// });
