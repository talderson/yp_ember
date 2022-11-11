import Ember from 'ember';
import { assign } from '@ember/polyfills';
import { inject as service } from "@ember/service";

export default Ember.Component.extend({
    router: service(),
    paginatorSize: 5,
    newPage: null,

    currentPage: Ember.computed('meta', function() {
        if ( !this.get('meta') || typeof this.get('meta').pagination.page === 'undefined' ) {
            return 1;
        }
        return this.get('meta').pagination.page;
    }),

    totalPages: Ember.computed('meta', function() {
        if ( !this.get('meta') ) {
            return null;
        }
        return this.get('meta').pagination['total_pages'];
    }),

    totalVisibleLinksCount: Ember.computed('totalPages', 'paginatorSize', function() {
        return ( this.get('totalPages') <= this.get('paginatorSize') ) ? this.get('totalPages') : this.get('paginatorSize');
    }),

    halfOfTotalVisibleLinksCount: Ember.computed('totalVisibleLinksCount', function() {
        return Math.ceil(this.get('totalVisibleLinksCount') / 2);
    }),

    firstPageLink: Ember.computed('currentPage', 'totalPages', 'paginatorSize', 'halfOfTotalVisibleLinksCount',  function() {
        if ( !this.get('meta') || this.get('currentPage') <= this.get('halfOfTotalVisibleLinksCount') + 1 || this.get('currentPage') === this.get('totalPages') && this.get('currentPage') === this.get('paginatorSize') ) {
            return null;
        }

        let queryParams = {
            page: 1
        };

        if ( typeof this.get('extraQueryParams') !== 'undefined' ) {
            assign( queryParams, this.get('extraQueryParams') );
        }

        return [
            this.get('routeLink'),
            {
                isQueryParams: true,
                values: queryParams
            }
        ];
    }),

    lastPageLink: Ember.computed('meta', 'currentPage', 'totalPages', 'paginatorSize', 'halfOfTotalVisibleLinksCount', function() {
        if ( !this.get('meta') || this.get('totalPages') <= 1 || this.get('totalPages') <= this.get('paginatorSize') || this.get('totalPages') <= this.get('currentPage') + this.get('halfOfTotalVisibleLinksCount') ) {
            return null;
        }

        let queryParams = {
            page: this.get('totalPages')
        };

        if ( typeof this.get('extraQueryParams') !== 'undefined' ) {
            assign( queryParams, this.get('extraQueryParams') );
        }

        return [
            this.get('routeLink'),
            {
                isQueryParams: true,
                values: queryParams
            }
        ];
    }),

    paginationLinks: Ember.computed('meta', 'currentPage', function(){
        let paginationLinks = [],
            routeLink = this.get('routeLink'),
            paginatorSize = this.get('paginatorSize'),
            currentPage = this.get('currentPage'),
            totalPages = this.get('totalPages'),
            totalVisibleLinksCount = this.get('totalVisibleLinksCount'),
            halfOfTotalVisibleLinksCount = this.get('halfOfTotalVisibleLinksCount'),
            startPageOffset = 1,
            endPageOffset = totalPages
        ;

        if ( currentPage - halfOfTotalVisibleLinksCount >= 1 && totalPages > paginatorSize ) {
            startPageOffset = currentPage - halfOfTotalVisibleLinksCount;
        }

        if ( currentPage + halfOfTotalVisibleLinksCount <= totalPages && totalPages > paginatorSize ) {
            endPageOffset = currentPage + halfOfTotalVisibleLinksCount;
        }

        if ( endPageOffset > 1 ) {
            for (let i = startPageOffset; i <= endPageOffset; i++) {

                let queryParams = {
                        page: i
                    };

                if ( typeof this.get('extraQueryParams') !== 'undefined' ) {
                    assign( queryParams, this.get('extraQueryParams') );
                }

                paginationLinks.push({
                    linkName: i,
                    params: [
                        routeLink,
                        {
                            isQueryParams: true,
                            values: queryParams
                        }
                    ]
                });
            }
        }

        return paginationLinks;

    }),
    actions: {
        goToPage(){
            let new_page = this.get('newPage');
            let pages = this.get('paginationLinks')
            console.log('fuckin sendr bud');
            if (typeof new_page !== 'undefined' && new_page != "") {
                let page = pages[0]                
                if (page.params[0] == 'raw-data') {
                    let id = this.get('meta')['instrument-id'];
                    page.params[1].values.page = new_page;
                    this.get('router').transitionTo(page.params[0], id, { queryParams: page.params[1].values});
                } else {
                    page.params[1].values.page = new_page;
                    this.get('router').transitionTo(page.params[0], { queryParams: page.params[1].values});
                }
            }
        }
    },
    keyDown: function(e) {
        if (e.keyCode === 13) {
            this.send('goToPage');
        }
    }
});
