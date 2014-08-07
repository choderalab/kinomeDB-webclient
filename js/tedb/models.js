function targetModel() {
    var self = this;
    self.uniprot = {
        ac: ko.observable(''),
        entry_name: ko.observable(''),
        family: ko.observable(''),
    }
    self.npubs = ko.observable('');
    self.ncbi_gene = ko.observableArray([]);
    self.ensembl_gene = ko.observableArray([]);
    self.hgnc = ko.observableArray([]);
    self.pdb = ko.observableArray([]);

    self.updatedata = function(data) {
        self.uniprot.ac(data.uniprot.ac);
        self.uniprot.entry_name(data.uniprot.entry_name);
        self.uniprot.family(data.uniprot.family);
        self.npubs(data.npubs);

        self.ncbi_gene([]);
        for (i in data.ncbi_gene) {
            self.ncbi_gene.push({gene_id: data.ncbi_gene[i].gene_id});
        };

        self.ensembl_gene([]);
        for (i in data.ensembl_gene) {
            self.ensembl_gene.push({gene_id: data.ensembl_gene[i].gene_id});
        };

        self.hgnc([]);
        for (i in data.hgnc) {
            h = data.hgnc[i];
            self.hgnc.push({gene_id: h.gene_id, approved_symbol: h.approved_symbol});
        };

        self.pdb([]);
        for (i in data.pdb) {
            self.pdb.push({pdbid: data.pdb[i].pdbid, pdb_href: 'http://www.rcsb.org/pdb/explore.do?structureID=' + data.pdb[i].pdbid.toLowerCase()});
        };
    };
}

function targetListModel() {
    var self = this;
    self.targets = ko.observableArray([]);

    self.updatedata = function(data) {
        self.targets(data);
    };
}
