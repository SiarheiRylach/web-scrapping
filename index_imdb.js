'use strict';

const requestPromise = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const request = require('request');

const URLS = [
    {
        url: 'https://www.imdb.com/title/tt0111161/?pf_rd_m=A2FGELUUNOQJNL',
        id: 'shawshank'
    },
    { 
        url: 'https://www.imdb.com/title/tt0068646/?ref_=tt_rec_tt',
        id: 'godfather'  
    }
];

(async () => {
    const moviesData = [];
    for (const movie of URLS) {
        const response = await requestPromise({
            uri: movie.url,
            headers: {
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'en-US,en;q=0.9',
                'cache-control': 'no-cache',
                'cookie': 'uu=BCYvaML0ZKJ_8SD8jfVb1JS22Xu7mpNB47G4SbytFIw6vFX8ltCKGVcl3H5f78eNgJkvmgHhSb3a%0D%0Ajkd6bc-T9XI1OgUsgcLqrj4mLiWAu3DWyEyXJbOPQpcdjVfyi88lJEb4X41YtxiJrhBS_T7NzeMg%0D%0A7g%0D%0A; session-id=147-2273977-4087336; session-id-time=2184247763; adblk=adblk_yes; ubid-main=133-1506793-3843367; session-token=jclaOGLNT8a30bTAiO9RVNCuIGv5XUvqOgjgxcoL+58NxFDH6lpaaxhjqO8J9Yh9AtS8sm1yJIu0ZJXCsf/8lHXxfIwZXv1U98w9CdXAktT8OH2tEliGMP8fDolp5yggsBl4cSdStmsBfk4ophHzKh0i9812QSp2EbYB9J4VpPfz90apT5aZedcGrM7MBQRr; csm-hit=tb:VD1PWVXTPE84W9N6ZGQR+s-VD1PWVXTPE84W9N6ZGQR|1553754048292&t:1553754048292&adb:adblk_yes',
                'pragma': 'no-cache',
                'upgrade-insecure-requests': 1,
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'
            },
            gzip: true
        });

        let $ = cheerio.load(response);
        let poster = $('div[class="poster"] > a > img').attr('src');

        let file = fs.createWriteStream(`${movie.id}.jpg`);
        await new Promise((resolve, reject) => {
            let stream = request({
                uri: poster,
                headers: {
                    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                    'accept-encoding': 'gzip, deflate, br',
                    'accept-language': 'en-US,en;q=0.9',
                    'cache-control': 'no-cache',
                    'cookie': 'uu=BCYvaML0ZKJ_8SD8jfVb1JS22Xu7mpNB47G4SbytFIw6vFX8ltCKGVcl3H5f78eNgJkvmgHhSb3a%0D%0Ajkd6bc-T9XI1OgUsgcLqrj4mLiWAu3DWyEyXJbOPQpcdjVfyi88lJEb4X41YtxiJrhBS_T7NzeMg%0D%0A7g%0D%0A; session-id=147-2273977-4087336; session-id-time=2184247763; adblk=adblk_yes; ubid-main=133-1506793-3843367; session-token=jclaOGLNT8a30bTAiO9RVNCuIGv5XUvqOgjgxcoL+58NxFDH6lpaaxhjqO8J9Yh9AtS8sm1yJIu0ZJXCsf/8lHXxfIwZXv1U98w9CdXAktT8OH2tEliGMP8fDolp5yggsBl4cSdStmsBfk4ophHzKh0i9812QSp2EbYB9J4VpPfz90apT5aZedcGrM7MBQRr; csm-hit=tb:VD1PWVXTPE84W9N6ZGQR+s-VD1PWVXTPE84W9N6ZGQR|1553754048292&t:1553754048292&adb:adblk_yes',
                    'pragma': 'no-cache',
                    'upgrade-insecure-requests': 1,
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36' 
                },
                gzip: true
            })
            .pipe(file)
            .on('finish', () => {
                console.log(`${movie.id} has finished downloading the image.`);
                resolve();
            })
            .on('error', error => {
                reject(error)
            });
        }).catch(error => console.log(`${movie.id} has an error on download. ${error}`));
        
    }
})();