import Ember from 'ember';

export default Ember.Controller.extend({
    authorized: Ember.computed('',function() {
        let settings = this.get('model');
        let auth = false;
        settings.forEach(element => {
            if (element['title'] == "GOOGLE_API") {
                //console.log(element['value']);
                if (element['value'] == 1) {
                    //console.log('true');
                    auth = true;
                }
            }
        });
        return auth;
    }),
    timeZones: [
        {
            id: 'Africa/Abidjan',
            title: 'Africa/Abidjan'
        },
        {
            id: 'Africa/Accra',
            title: 'Africa/Accra'
        },
        {
            id: 'Africa/Addis_Ababa',
            title: 'Africa/Addis_Ababa'
        },
        {
            id: 'Africa/Algiers',
            title: 'Africa/Algiers'
        },
        {
            id: 'Africa/Asmara',
            title: 'Africa/Asmara'
        },
        {
            id: 'Africa/Asmera',
            title: 'Africa/Asmera'
        },
        {
            id: 'Africa/Bamako',
            title: 'Africa/Bamako'
        },
        {
            id: 'Africa/Bangui',
            title: 'Africa/Bangui'
        },
        {
            id: 'Africa/Banjul',
            title: 'Africa/Banjul'
        },
        {
            id: 'Africa/Bissau',
            title: 'Africa/Bissau'
        },
        {
            id: 'Africa/Blantyre',
            title: 'Africa/Blantyre'
        },
        {
            id: 'Africa/Brazzaville',
            title: 'Africa/Brazzaville'
        },
        {
            id: 'Africa/Bujumbura',
            title: 'Africa/Bujumbura'
        },
        {
            id: 'Africa/Cairo',
            title: 'Africa/Cairo'
        },
        {
            id: 'Africa/Casablanca',
            title: 'Africa/Casablanca'
        },
        {
            id: 'Africa/Ceuta',
            title: 'Africa/Ceuta'
        },
        {
            id: 'Africa/Conakry',
            title: 'Africa/Conakry'
        },
        {
            id: 'Africa/Dakar',
            title: 'Africa/Dakar'
        },
        {
            id: 'Africa/Dar_es_Salaam',
            title: 'Africa/Dar_es_Salaam'
        },
        {
            id: 'Africa/Djibouti',
            title: 'Africa/Djibouti'
        },
        {
            id: 'Africa/Douala',
            title: 'Africa/Douala'
        },
        {
            id: 'Africa/El_Aaiun',
            title: 'Africa/El_Aaiun'
        },
        {
            id: 'Africa/Freetown',
            title: 'Africa/Freetown'
        },
        {
            id: 'Africa/Gaborone',
            title: 'Africa/Gaborone'
        },
        {
            id: 'Africa/Harare',
            title: 'Africa/Harare'
        },
        {
            id: 'Africa/Johannesburg',
            title: 'Africa/Johannesburg'
        },
        {
            id: 'Africa/Juba',
            title: 'Africa/Juba'
        },
        {
            id: 'Africa/Kampala',
            title: 'Africa/Kampala'
        },
        {
            id: 'Africa/Khartoum',
            title: 'Africa/Khartoum'
        },
        {
            id: 'Africa/Kigali',
            title: 'Africa/Kigali'
        },
        {
            id: 'Africa/Kinshasa',
            title: 'Africa/Kinshasa'
        },
        {
            id: 'Africa/Lagos',
            title: 'Africa/Lagos'
        },
        {
            id: 'Africa/Libreville',
            title: 'Africa/Libreville'
        },
        {
            id: 'Africa/Lome',
            title: 'Africa/Lome'
        },
        {
            id: 'Africa/Luanda',
            title: 'Africa/Luanda'
        },
        {
            id: 'Africa/Lubumbashi',
            title: 'Africa/Lubumbashi'
        },
        {
            id: 'Africa/Lusaka',
            title: 'Africa/Lusaka'
        },
        {
            id: 'Africa/Malabo',
            title: 'Africa/Malabo'
        },
        {
            id: 'Africa/Maputo',
            title: 'Africa/Maputo'
        },
        {
            id: 'Africa/Maseru',
            title: 'Africa/Maseru'
        },
        {
            id: 'Africa/Mbabane',
            title: 'Africa/Mbabane'
        },
        {
            id: 'Africa/Mogadishu',
            title: 'Africa/Mogadishu'
        },
        {
            id: 'Africa/Monrovia',
            title: 'Africa/Monrovia'
        },
        {
            id: 'Africa/Nairobi',
            title: 'Africa/Nairobi'
        },
        {
            id: 'Africa/Ndjamena',
            title: 'Africa/Ndjamena'
        },
        {
            id: 'Africa/Niamey',
            title: 'Africa/Niamey'
        },
        {
            id: 'Africa/Nouakchott',
            title: 'Africa/Nouakchott'
        },
        {
            id: 'Africa/Ouagadougou',
            title: 'Africa/Ouagadougou'
        },
        {
            id: 'Africa/Porto-Novo',
            title: 'Africa/Porto-Novo'
        },
        {
            id: 'Africa/Sao_Tome',
            title: 'Africa/Sao_Tome'
        },
        {
            id: 'Africa/Timbuktu',
            title: 'Africa/Timbuktu'
        },
        {
            id: 'Africa/Tripoli',
            title: 'Africa/Tripoli'
        },
        {
            id: 'Africa/Tunis',
            title: 'Africa/Tunis'
        },
        {
            id: 'Africa/Windhoek',
            title: 'Africa/Windhoek'
        },
        {
            id: 'America/Adak',
            title: 'America/Adak'
        },
        {
            id: 'America/Anchorage',
            title: 'America/Anchorage'
        },
        {
            id: 'America/Anguilla',
            title: 'America/Anguilla'
        },
        {
            id: 'America/Antigua',
            title: 'America/Antigua'
        },
        {
            id: 'America/Araguaina',
            title: 'America/Araguaina'
        },
        {
            id: 'America/Argentina/Buenos_Aires',
            title: 'America/Argentina/Buenos_Aires'
        },
        {
            id: 'America/Argentina/Catamarca',
            title: 'America/Argentina/Catamarca'
        },
        {
            id: 'America/Argentina/ComodRivadavia',
            title: 'America/Argentina/ComodRivadavia'
        },
        {
            id: 'America/Argentina/Cordoba',
            title: 'America/Argentina/Cordoba'
        },
        {
            id: 'America/Argentina/Jujuy',
            title: 'America/Argentina/Jujuy'
        },
        {
            id: 'America/Argentina/La_Rioja',
            title: 'America/Argentina/La_Rioja'
        },
        {
            id: 'America/Argentina/Mendoza',
            title: 'America/Argentina/Mendoza'
        },
        {
            id: 'America/Argentina/Rio_Gallegos',
            title: 'America/Argentina/Rio_Gallegos'
        },
        {
            id: 'America/Argentina/Salta',
            title: 'America/Argentina/Salta'
        },
        {
            id: 'America/Argentina/San_Juan',
            title: 'America/Argentina/San_Juan'
        },
        {
            id: 'America/Argentina/San_Luis',
            title: 'America/Argentina/San_Luis'
        },
        {
            id: 'America/Argentina/Tucuman',
            title: 'America/Argentina/Tucuman'
        },
        {
            id: 'America/Argentina/Ushuaia',
            title: 'America/Argentina/Ushuaia'
        },
        {
            id: 'America/Aruba',
            title: 'America/Aruba'
        },
        {
            id: 'America/Asuncion',
            title: 'America/Asuncion'
        },
        {
            id: 'America/Atikokan',
            title: 'America/Atikokan'
        },
        {
            id: 'America/Atka',
            title: 'America/Atka'
        },
        {
            id: 'America/Bahia',
            title: 'America/Bahia'
        },
        {
            id: 'America/Bahia_Banderas',
            title: 'America/Bahia_Banderas'
        },
        {
            id: 'America/Barbados',
            title: 'America/Barbados'
        },
        {
            id: 'America/Belem',
            title: 'America/Belem'
        },
        {
            id: 'America/Belize',
            title: 'America/Belize'
        },
        {
            id: 'America/Blanc-Sablon',
            title: 'America/Blanc-Sablon'
        },
        {
            id: 'America/Boa_Vista',
            title: 'America/Boa_Vista'
        },
        {
            id: 'America/Bogota',
            title: 'America/Bogota'
        },
        {
            id: 'America/Boise',
            title: 'America/Boise'
        },
        {
            id: 'America/Buenos_Aires',
            title: 'America/Buenos_Aires'
        },
        {
            id: 'America/Cambridge_Bay',
            title: 'America/Cambridge_Bay'
        },
        {
            id: 'America/Campo_Grande',
            title: 'America/Campo_Grande'
        },
        {
            id: 'America/Cancun',
            title: 'America/Cancun'
        },
        {
            id: 'America/Caracas',
            title: 'America/Caracas'
        },
        {
            id: 'America/Catamarca',
            title: 'America/Catamarca'
        },
        {
            id: 'America/Cayenne',
            title: 'America/Cayenne'
        },
        {
            id: 'America/Cayman',
            title: 'America/Cayman'
        },
        {
            id: 'America/Chicago',
            title: 'America/Chicago'
        },
        {
            id: 'America/Chihuahua',
            title: 'America/Chihuahua'
        },
        {
            id: 'America/Coral_Harbour',
            title: 'America/Coral_Harbour'
        },
        {
            id: 'America/Cordoba',
            title: 'America/Cordoba'
        },
        {
            id: 'America/Costa_Rica',
            title: 'America/Costa_Rica'
        },
        {
            id: 'America/Creston',
            title: 'America/Creston'
        },
        {
            id: 'America/Cuiaba',
            title: 'America/Cuiaba'
        },
        {
            id: 'America/Curacao',
            title: 'America/Curacao'
        },
        {
            id: 'America/Danmarkshavn',
            title: 'America/Danmarkshavn'
        },
        {
            id: 'America/Dawson',
            title: 'America/Dawson'
        },
        {
            id: 'America/Dawson_Creek',
            title: 'America/Dawson_Creek'
        },
        {
            id: 'America/Denver',
            title: 'America/Denver'
        },
        {
            id: 'America/Detroit',
            title: 'America/Detroit'
        },
        {
            id: 'America/Dominica',
            title: 'America/Dominica'
        },
        {
            id: 'America/Edmonton',
            title: 'America/Edmonton'
        },
        {
            id: 'America/Eirunepe',
            title: 'America/Eirunepe'
        },
        {
            id: 'America/El_Salvador',
            title: 'America/El_Salvador'
        },
        {
            id: 'America/Ensenada',
            title: 'America/Ensenada'
        },
        {
            id: 'America/Fort_Nelson',
            title: 'America/Fort_Nelson'
        },
        {
            id: 'America/Fort_Wayne',
            title: 'America/Fort_Wayne'
        },
        {
            id: 'America/Fortaleza',
            title: 'America/Fortaleza'
        },
        {
            id: 'America/Glace_Bay',
            title: 'America/Glace_Bay'
        },
        {
            id: 'America/Godthab',
            title: 'America/Godthab'
        },
        {
            id: 'America/Goose_Bay',
            title: 'America/Goose_Bay'
        },
        {
            id: 'America/Grand_Turk',
            title: 'America/Grand_Turk'
        },
        {
            id: 'America/Grenada',
            title: 'America/Grenada'
        },
        {
            id: 'America/Guadeloupe',
            title: 'America/Guadeloupe'
        },
        {
            id: 'America/Guatemala',
            title: 'America/Guatemala'
        },
        {
            id: 'America/Guayaquil',
            title: 'America/Guayaquil'
        },
        {
            id: 'America/Guyana',
            title: 'America/Guyana'
        },
        {
            id: 'America/Halifax',
            title: 'America/Halifax'
        },
        {
            id: 'America/Havana',
            title: 'America/Havana'
        },
        {
            id: 'America/Hermosillo',
            title: 'America/Hermosillo'
        },
        {
            id: 'America/Indiana/Indianapolis',
            title: 'America/Indiana/Indianapolis'
        },
        {
            id: 'America/Indiana/Knox',
            title: 'America/Indiana/Knox'
        },
        {
            id: 'America/Indiana/Marengo',
            title: 'America/Indiana/Marengo'
        },
        {
            id: 'America/Indiana/Petersburg',
            title: 'America/Indiana/Petersburg'
        },
        {
            id: 'America/Indiana/Tell_City',
            title: 'America/Indiana/Tell_City'
        },
        {
            id: 'America/Indiana/Vevay',
            title: 'America/Indiana/Vevay'
        },
        {
            id: 'America/Indiana/Vincennes',
            title: 'America/Indiana/Vincennes'
        },
        {
            id: 'America/Indiana/Winamac',
            title: 'America/Indiana/Winamac'
        },
        {
            id: 'America/Indianapolis',
            title: 'America/Indianapolis'
        },
        {
            id: 'America/Inuvik',
            title: 'America/Inuvik'
        },
        {
            id: 'America/Iqaluit',
            title: 'America/Iqaluit'
        },
        {
            id: 'America/Jamaica',
            title: 'America/Jamaica'
        },
        {
            id: 'America/Jujuy',
            title: 'America/Jujuy'
        },
        {
            id: 'America/Juneau',
            title: 'America/Juneau'
        },
        {
            id: 'America/Kentucky/Louisville',
            title: 'America/Kentucky/Louisville'
        },
        {
            id: 'America/Kentucky/Monticello',
            title: 'America/Kentucky/Monticello'
        },
        {
            id: 'America/Knox_IN',
            title: 'America/Knox_IN'
        },
        {
            id: 'America/Kralendijk',
            title: 'America/Kralendijk'
        },
        {
            id: 'America/La_Paz',
            title: 'America/La_Paz'
        },
        {
            id: 'America/Lima',
            title: 'America/Lima'
        },
        {
            id: 'America/Los_Angeles',
            title: 'America/Los_Angeles'
        },
        {
            id: 'America/Louisville',
            title: 'America/Louisville'
        },
        {
            id: 'America/Lower_Princes',
            title: 'America/Lower_Princes'
        },
        {
            id: 'America/Maceio',
            title: 'America/Maceio'
        },
        {
            id: 'America/Managua',
            title: 'America/Managua'
        },
        {
            id: 'America/Manaus',
            title: 'America/Manaus'
        },
        {
            id: 'America/Marigot',
            title: 'America/Marigot'
        },
        {
            id: 'America/Martinique',
            title: 'America/Martinique'
        },
        {
            id: 'America/Matamoros',
            title: 'America/Matamoros'
        },
        {
            id: 'America/Mazatlan',
            title: 'America/Mazatlan'
        },
        {
            id: 'America/Mendoza',
            title: 'America/Mendoza'
        },
        {
            id: 'America/Menominee',
            title: 'America/Menominee'
        },
        {
            id: 'America/Merida',
            title: 'America/Merida'
        },
        {
            id: 'America/Metlakatla',
            title: 'America/Metlakatla'
        },
        {
            id: 'America/Mexico_City',
            title: 'America/Mexico_City'
        },
        {
            id: 'America/Miquelon',
            title: 'America/Miquelon'
        },
        {
            id: 'America/Moncton',
            title: 'America/Moncton'
        },
        {
            id: 'America/Monterrey',
            title: 'America/Monterrey'
        },
        {
            id: 'America/Montevideo',
            title: 'America/Montevideo'
        },
        {
            id: 'America/Montreal',
            title: 'America/Montreal'
        },
        {
            id: 'America/Montserrat',
            title: 'America/Montserrat'
        },
        {
            id: 'America/Nassau',
            title: 'America/Nassau'
        },
        {
            id: 'America/New_York',
            title: 'America/New_York'
        },
        {
            id: 'America/Nipigon',
            title: 'America/Nipigon'
        },
        {
            id: 'America/Nome',
            title: 'America/Nome'
        },
        {
            id: 'America/Noronha',
            title: 'America/Noronha'
        },
        {
            id: 'America/North_Dakota/Beulah',
            title: 'America/North_Dakota/Beulah'
        },
        {
            id: 'America/North_Dakota/Center',
            title: 'America/North_Dakota/Center'
        },
        {
            id: 'America/North_Dakota/New_Salem',
            title: 'America/North_Dakota/New_Salem'
        },
        {
            id: 'America/Ojinaga',
            title: 'America/Ojinaga'
        },
        {
            id: 'America/Panama',
            title: 'America/Panama'
        },
        {
            id: 'America/Pangnirtung',
            title: 'America/Pangnirtung'
        },
        {
            id: 'America/Paramaribo',
            title: 'America/Paramaribo'
        },
        {
            id: 'America/Phoenix',
            title: 'America/Phoenix'
        },
        {
            id: 'America/Port-au-Prince',
            title: 'America/Port-au-Prince'
        },
        {
            id: 'America/Port_of_Spain',
            title: 'America/Port_of_Spain'
        },
        {
            id: 'America/Porto_Acre',
            title: 'America/Porto_Acre'
        },
        {
            id: 'America/Porto_Velho',
            title: 'America/Porto_Velho'
        },
        {
            id: 'America/Puerto_Rico',
            title: 'America/Puerto_Rico'
        },
        {
            id: 'America/Punta_Arenas',
            title: 'America/Punta_Arenas'
        },
        {
            id: 'America/Rainy_River',
            title: 'America/Rainy_River'
        },
        {
            id: 'America/Rankin_Inlet',
            title: 'America/Rankin_Inlet'
        },
        {
            id: 'America/Recife',
            title: 'America/Recife'
        },
        {
            id: 'America/Regina',
            title: 'America/Regina'
        },
        {
            id: 'America/Resolute',
            title: 'America/Resolute'
        },
        {
            id: 'America/Rio_Branco',
            title: 'America/Rio_Branco'
        },
        {
            id: 'America/Rosario',
            title: 'America/Rosario'
        },
        {
            id: 'America/Santa_Isabel',
            title: 'America/Santa_Isabel'
        },
        {
            id: 'America/Santarem',
            title: 'America/Santarem'
        },
        {
            id: 'America/Santiago',
            title: 'America/Santiago'
        },
        {
            id: 'America/Santo_Domingo',
            title: 'America/Santo_Domingo'
        },
        {
            id: 'America/Sao_Paulo',
            title: 'America/Sao_Paulo'
        },
        {
            id: 'America/Scoresbysund',
            title: 'America/Scoresbysund'
        },
        {
            id: 'America/Shiprock',
            title: 'America/Shiprock'
        },
        {
            id: 'America/Sitka',
            title: 'America/Sitka'
        },
        {
            id: 'America/St_Barthelemy',
            title: 'America/St_Barthelemy'
        },
        {
            id: 'America/St_Johns',
            title: 'America/St_Johns'
        },
        {
            id: 'America/St_Kitts',
            title: 'America/St_Kitts'
        },
        {
            id: 'America/St_Lucia',
            title: 'America/St_Lucia'
        },
        {
            id: 'America/St_Thomas',
            title: 'America/St_Thomas'
        },
        {
            id: 'America/St_Vincent',
            title: 'America/St_Vincent'
        },
        {
            id: 'America/Swift_Current',
            title: 'America/Swift_Current'
        },
        {
            id: 'America/Tegucigalpa',
            title: 'America/Tegucigalpa'
        },
        {
            id: 'America/Thule',
            title: 'America/Thule'
        },
        {
            id: 'America/Thunder_Bay',
            title: 'America/Thunder_Bay'
        },
        {
            id: 'America/Tijuana',
            title: 'America/Tijuana'
        },
        {
            id: 'America/Toronto',
            title: 'America/Toronto'
        },
        {
            id: 'America/Tortola',
            title: 'America/Tortola'
        },
        {
            id: 'America/Vancouver',
            title: 'America/Vancouver'
        },
        {
            id: 'America/Virgin',
            title: 'America/Virgin'
        },
        {
            id: 'America/Whitehorse',
            title: 'America/Whitehorse'
        },
        {
            id: 'America/Winnipeg',
            title: 'America/Winnipeg'
        },
        {
            id: 'America/Yakutat',
            title: 'America/Yakutat'
        },
        {
            id: 'America/Yellowknife',
            title: 'America/Yellowknife'
        },
        {
            id: 'Antarctica/Casey',
            title: 'Antarctica/Casey'
        },
        {
            id: 'Antarctica/Davis',
            title: 'Antarctica/Davis'
        },
        {
            id: 'Antarctica/DumontDUrville',
            title: 'Antarctica/DumontDUrville'
        },
        {
            id: 'Antarctica/Macquarie',
            title: 'Antarctica/Macquarie'
        },
        {
            id: 'Antarctica/Mawson',
            title: 'Antarctica/Mawson'
        },
        {
            id: 'Antarctica/McMurdo',
            title: 'Antarctica/McMurdo'
        },
        {
            id: 'Antarctica/Palmer',
            title: 'Antarctica/Palmer'
        },
        {
            id: 'Antarctica/Rothera',
            title: 'Antarctica/Rothera'
        },
        {
            id: 'Antarctica/South_Pole',
            title: 'Antarctica/South_Pole'
        },
        {
            id: 'Antarctica/Syowa',
            title: 'Antarctica/Syowa'
        },
        {
            id: 'Antarctica/Troll',
            title: 'Antarctica/Troll'
        },
        {
            id: 'Antarctica/Vostok',
            title: 'Antarctica/Vostok'
        },
        {
            id: 'Arctic/Longyearbyen',
            title: 'Arctic/Longyearbyen'
        },
        {
            id: 'Asia/Aden',
            title: 'Asia/Aden'
        },
        {
            id: 'Asia/Almaty',
            title: 'Asia/Almaty'
        },
        {
            id: 'Asia/Amman',
            title: 'Asia/Amman'
        },
        {
            id: 'Asia/Anadyr',
            title: 'Asia/Anadyr'
        },
        {
            id: 'Asia/Aqtau',
            title: 'Asia/Aqtau'
        },
        {
            id: 'Asia/Aqtobe',
            title: 'Asia/Aqtobe'
        },
        {
            id: 'Asia/Ashgabat',
            title: 'Asia/Ashgabat'
        },
        {
            id: 'Asia/Ashkhabad',
            title: 'Asia/Ashkhabad'
        },
        {
            id: 'Asia/Atyrau',
            title: 'Asia/Atyrau'
        },
        {
            id: 'Asia/Baghdad',
            title: 'Asia/Baghdad'
        },
        {
            id: 'Asia/Bahrain',
            title: 'Asia/Bahrain'
        },
        {
            id: 'Asia/Baku',
            title: 'Asia/Baku'
        },
        {
            id: 'Asia/Bangkok',
            title: 'Asia/Bangkok'
        },
        {
            id: 'Asia/Barnaul',
            title: 'Asia/Barnaul'
        },
        {
            id: 'Asia/Beirut',
            title: 'Asia/Beirut'
        },
        {
            id: 'Asia/Bishkek',
            title: 'Asia/Bishkek'
        },
        {
            id: 'Asia/Brunei',
            title: 'Asia/Brunei'
        },
        {
            id: 'Asia/Calcutta',
            title: 'Asia/Calcutta'
        },
        {
            id: 'Asia/Chita',
            title: 'Asia/Chita'
        },
        {
            id: 'Asia/Choibalsan',
            title: 'Asia/Choibalsan'
        },
        {
            id: 'Asia/Chongqing',
            title: 'Asia/Chongqing'
        },
        {
            id: 'Asia/Chungking',
            title: 'Asia/Chungking'
        },
        {
            id: 'Asia/Colombo',
            title: 'Asia/Colombo'
        },
        {
            id: 'Asia/Dacca',
            title: 'Asia/Dacca'
        },
        {
            id: 'Asia/Damascus',
            title: 'Asia/Damascus'
        },
        {
            id: 'Asia/Dhaka',
            title: 'Asia/Dhaka'
        },
        {
            id: 'Asia/Dili',
            title: 'Asia/Dili'
        },
        {
            id: 'Asia/Dubai',
            title: 'Asia/Dubai'
        },
        {
            id: 'Asia/Dushanbe',
            title: 'Asia/Dushanbe'
        },
        {
            id: 'Asia/Famagusta',
            title: 'Asia/Famagusta'
        },
        {
            id: 'Asia/Gaza',
            title: 'Asia/Gaza'
        },
        {
            id: 'Asia/Harbin',
            title: 'Asia/Harbin'
        },
        {
            id: 'Asia/Hebron',
            title: 'Asia/Hebron'
        },
        {
            id: 'Asia/Ho_Chi_Minh',
            title: 'Asia/Ho_Chi_Minh'
        },
        {
            id: 'Asia/Hong_Kong',
            title: 'Asia/Hong_Kong'
        },
        {
            id: 'Asia/Hovd',
            title: 'Asia/Hovd'
        },
        {
            id: 'Asia/Irkutsk',
            title: 'Asia/Irkutsk'
        },
        {
            id: 'Asia/Istanbul',
            title: 'Asia/Istanbul'
        },
        {
            id: 'Asia/Jakarta',
            title: 'Asia/Jakarta'
        },
        {
            id: 'Asia/Jayapura',
            title: 'Asia/Jayapura'
        },
        {
            id: 'Asia/Jerusalem',
            title: 'Asia/Jerusalem'
        },
        {
            id: 'Asia/Kabul',
            title: 'Asia/Kabul'
        },
        {
            id: 'Asia/Kamchatka',
            title: 'Asia/Kamchatka'
        },
        {
            id: 'Asia/Karachi',
            title: 'Asia/Karachi'
        },
        {
            id: 'Asia/Kashgar',
            title: 'Asia/Kashgar'
        },
        {
            id: 'Asia/Kathmandu',
            title: 'Asia/Kathmandu'
        },
        {
            id: 'Asia/Katmandu',
            title: 'Asia/Katmandu'
        },
        {
            id: 'Asia/Khandyga',
            title: 'Asia/Khandyga'
        },
        {
            id: 'Asia/Kolkata',
            title: 'Asia/Kolkata'
        },
        {
            id: 'Asia/Krasnoyarsk',
            title: 'Asia/Krasnoyarsk'
        },
        {
            id: 'Asia/Kuala_Lumpur',
            title: 'Asia/Kuala_Lumpur'
        },
        {
            id: 'Asia/Kuching',
            title: 'Asia/Kuching'
        },
        {
            id: 'Asia/Kuwait',
            title: 'Asia/Kuwait'
        },
        {
            id: 'Asia/Macao',
            title: 'Asia/Macao'
        },
        {
            id: 'Asia/Macau',
            title: 'Asia/Macau'
        },
        {
            id: 'Asia/Magadan',
            title: 'Asia/Magadan'
        },
        {
            id: 'Asia/Makassar',
            title: 'Asia/Makassar'
        },
        {
            id: 'Asia/Manila',
            title: 'Asia/Manila'
        },
        {
            id: 'Asia/Muscat',
            title: 'Asia/Muscat'
        },
        {
            id: 'Asia/Nicosia',
            title: 'Asia/Nicosia'
        },
        {
            id: 'Asia/Novokuznetsk',
            title: 'Asia/Novokuznetsk'
        },
        {
            id: 'Asia/Novosibirsk',
            title: 'Asia/Novosibirsk'
        },
        {
            id: 'Asia/Omsk',
            title: 'Asia/Omsk'
        },
        {
            id: 'Asia/Oral',
            title: 'Asia/Oral'
        },
        {
            id: 'Asia/Phnom_Penh',
            title: 'Asia/Phnom_Penh'
        },
        {
            id: 'Asia/Pontianak',
            title: 'Asia/Pontianak'
        },
        {
            id: 'Asia/Pyongyang',
            title: 'Asia/Pyongyang'
        },
        {
            id: 'Asia/Qatar',
            title: 'Asia/Qatar'
        },
        {
            id: 'Asia/Qyzylorda',
            title: 'Asia/Qyzylorda'
        },
        {
            id: 'Asia/Rangoon',
            title: 'Asia/Rangoon'
        },
        {
            id: 'Asia/Riyadh',
            title: 'Asia/Riyadh'
        },
        {
            id: 'Asia/Saigon',
            title: 'Asia/Saigon'
        },
        {
            id: 'Asia/Sakhalin',
            title: 'Asia/Sakhalin'
        },
        {
            id: 'Asia/Samarkand',
            title: 'Asia/Samarkand'
        },
        {
            id: 'Asia/Seoul',
            title: 'Asia/Seoul'
        },
        {
            id: 'Asia/Shanghai',
            title: 'Asia/Shanghai'
        },
        {
            id: 'Asia/Singapore',
            title: 'Asia/Singapore'
        },
        {
            id: 'Asia/Srednekolymsk',
            title: 'Asia/Srednekolymsk'
        },
        {
            id: 'Asia/Taipei',
            title: 'Asia/Taipei'
        },
        {
            id: 'Asia/Tashkent',
            title: 'Asia/Tashkent'
        },
        {
            id: 'Asia/Tbilisi',
            title: 'Asia/Tbilisi'
        },
        {
            id: 'Asia/Tehran',
            title: 'Asia/Tehran'
        },
        {
            id: 'Asia/Tel_Aviv',
            title: 'Asia/Tel_Aviv'
        },
        {
            id: 'Asia/Thimbu',
            title: 'Asia/Thimbu'
        },
        {
            id: 'Asia/Thimphu',
            title: 'Asia/Thimphu'
        },
        {
            id: 'Asia/Tokyo',
            title: 'Asia/Tokyo'
        },
        {
            id: 'Asia/Tomsk',
            title: 'Asia/Tomsk'
        },
        {
            id: 'Asia/Ujung_Pandang',
            title: 'Asia/Ujung_Pandang'
        },
        {
            id: 'Asia/Ulaanbaatar',
            title: 'Asia/Ulaanbaatar'
        },
        {
            id: 'Asia/Ulan_Bator',
            title: 'Asia/Ulan_Bator'
        },
        {
            id: 'Asia/Urumqi',
            title: 'Asia/Urumqi'
        },
        {
            id: 'Asia/Ust-Nera',
            title: 'Asia/Ust-Nera'
        },
        {
            id: 'Asia/Vientiane',
            title: 'Asia/Vientiane'
        },
        {
            id: 'Asia/Vladivostok',
            title: 'Asia/Vladivostok'
        },
        {
            id: 'Asia/Yakutsk',
            title: 'Asia/Yakutsk'
        },
        {
            id: 'Asia/Yangon',
            title: 'Asia/Yangon'
        },
        {
            id: 'Asia/Yekaterinburg',
            title: 'Asia/Yekaterinburg'
        },
        {
            id: 'Asia/Yerevan',
            title: 'Asia/Yerevan'
        },
        {
            id: 'Atlantic/Azores',
            title: 'Atlantic/Azores'
        },
        {
            id: 'Atlantic/Bermuda',
            title: 'Atlantic/Bermuda'
        },
        {
            id: 'Atlantic/Canary',
            title: 'Atlantic/Canary'
        },
        {
            id: 'Atlantic/Cape_Verde',
            title: 'Atlantic/Cape_Verde'
        },
        {
            id: 'Atlantic/Faeroe',
            title: 'Atlantic/Faeroe'
        },
        {
            id: 'Atlantic/Faroe',
            title: 'Atlantic/Faroe'
        },
        {
            id: 'Atlantic/Jan_Mayen',
            title: 'Atlantic/Jan_Mayen'
        },
        {
            id: 'Atlantic/Madeira',
            title: 'Atlantic/Madeira'
        },
        {
            id: 'Atlantic/Reykjavik',
            title: 'Atlantic/Reykjavik'
        },
        {
            id: 'Atlantic/South_Georgia',
            title: 'Atlantic/South_Georgia'
        },
        {
            id: 'Atlantic/St_Helena',
            title: 'Atlantic/St_Helena'
        },
        {
            id: 'Atlantic/Stanley',
            title: 'Atlantic/Stanley'
        },
        {
            id: 'Australia/ACT',
            title: 'Australia/ACT'
        },
        {
            id: 'Australia/Adelaide',
            title: 'Australia/Adelaide'
        },
        {
            id: 'Australia/Brisbane',
            title: 'Australia/Brisbane'
        },
        {
            id: 'Australia/Broken_Hill',
            title: 'Australia/Broken_Hill'
        },
        {
            id: 'Australia/Canberra',
            title: 'Australia/Canberra'
        },
        {
            id: 'Australia/Currie',
            title: 'Australia/Currie'
        },
        {
            id: 'Australia/Darwin',
            title: 'Australia/Darwin'
        },
        {
            id: 'Australia/Eucla',
            title: 'Australia/Eucla'
        },
        {
            id: 'Australia/Hobart',
            title: 'Australia/Hobart'
        },
        {
            id: 'Australia/LHI',
            title: 'Australia/LHI'
        },
        {
            id: 'Australia/Lindeman',
            title: 'Australia/Lindeman'
        },
        {
            id: 'Australia/Lord_Howe',
            title: 'Australia/Lord_Howe'
        },
        {
            id: 'Australia/Melbourne',
            title: 'Australia/Melbourne'
        },
        {
            id: 'Australia/NSW',
            title: 'Australia/NSW'
        },
        {
            id: 'Australia/North',
            title: 'Australia/North'
        },
        {
            id: 'Australia/Perth',
            title: 'Australia/Perth'
        },
        {
            id: 'Australia/Queensland',
            title: 'Australia/Queensland'
        },
        {
            id: 'Australia/South',
            title: 'Australia/South'
        },
        {
            id: 'Australia/Sydney',
            title: 'Australia/Sydney'
        },
        {
            id: 'Australia/Tasmania',
            title: 'Australia/Tasmania'
        },
        {
            id: 'Australia/Victoria',
            title: 'Australia/Victoria'
        },
        {
            id: 'Australia/West',
            title: 'Australia/West'
        },
        {
            id: 'Australia/Yancowinna',
            title: 'Australia/Yancowinna'
        },
        {
            id: 'Brazil/Acre',
            title: 'Brazil/Acre'
        },
        {
            id: 'Brazil/DeNoronha',
            title: 'Brazil/DeNoronha'
        },
        {
            id: 'Brazil/East',
            title: 'Brazil/East'
        },
        {
            id: 'Brazil/West',
            title: 'Brazil/West'
        },
        {
            id: 'CET',
            title: 'CET'
        },
        {
            id: 'CST6CDT',
            title: 'CST6CDT'
        },
        {
            id: 'Canada/Atlantic',
            title: 'Canada/Atlantic'
        },
        {
            id: 'Canada/Central',
            title: 'Canada/Central'
        },
        {
            id: 'Canada/East-Saskatchewan',
            title: 'Canada/East-Saskatchewan'
        },
        {
            id: 'Canada/Eastern',
            title: 'Canada/Eastern'
        },
        {
            id: 'Canada/Mountain',
            title: 'Canada/Mountain'
        },
        {
            id: 'Canada/Newfoundland',
            title: 'Canada/Newfoundland'
        },
        {
            id: 'Canada/Pacific',
            title: 'Canada/Pacific'
        },
        {
            id: 'Canada/Saskatchewan',
            title: 'Canada/Saskatchewan'
        },
        {
            id: 'Canada/Yukon',
            title: 'Canada/Yukon'
        },
        {
            id: 'Chile/Continental',
            title: 'Chile/Continental'
        },
        {
            id: 'Chile/EasterIsland',
            title: 'Chile/EasterIsland'
        },
        {
            id: 'Cuba',
            title: 'Cuba'
        },
        {
            id: 'EET',
            title: 'EET'
        },
        {
            id: 'EST',
            title: 'EST'
        },
        {
            id: 'EST5EDT',
            title: 'EST5EDT'
        },
        {
            id: 'Egypt',
            title: 'Egypt'
        },
        {
            id: 'Eire',
            title: 'Eire'
        },
        {
            id: 'Etc/GMT',
            title: 'Etc/GMT'
        },
        {
            id: 'Etc/GMT+0',
            title: 'Etc/GMT+0'
        },
        {
            id: 'Etc/GMT+1',
            title: 'Etc/GMT+1'
        },
        {
            id: 'Etc/GMT+10',
            title: 'Etc/GMT+10'
        },
        {
            id: 'Etc/GMT+11',
            title: 'Etc/GMT+11'
        },
        {
            id: 'Etc/GMT+12',
            title: 'Etc/GMT+12'
        },
        {
            id: 'Etc/GMT+2',
            title: 'Etc/GMT+2'
        },
        {
            id: 'Etc/GMT+3',
            title: 'Etc/GMT+3'
        },
        {
            id: 'Etc/GMT+4',
            title: 'Etc/GMT+4'
        },
        {
            id: 'Etc/GMT+5',
            title: 'Etc/GMT+5'
        },
        {
            id: 'Etc/GMT+6',
            title: 'Etc/GMT+6'
        },
        {
            id: 'Etc/GMT+7',
            title: 'Etc/GMT+7'
        },
        {
            id: 'Etc/GMT+8',
            title: 'Etc/GMT+8'
        },
        {
            id: 'Etc/GMT+9',
            title: 'Etc/GMT+9'
        },
        {
            id: 'Etc/GMT-0',
            title: 'Etc/GMT-0'
        },
        {
            id: 'Etc/GMT-1',
            title: 'Etc/GMT-1'
        },
        {
            id: 'Etc/GMT-10',
            title: 'Etc/GMT-10'
        },
        {
            id: 'Etc/GMT-11',
            title: 'Etc/GMT-11'
        },
        {
            id: 'Etc/GMT-12',
            title: 'Etc/GMT-12'
        },
        {
            id: 'Etc/GMT-13',
            title: 'Etc/GMT-13'
        },
        {
            id: 'Etc/GMT-14',
            title: 'Etc/GMT-14'
        },
        {
            id: 'Etc/GMT-2',
            title: 'Etc/GMT-2'
        },
        {
            id: 'Etc/GMT-3',
            title: 'Etc/GMT-3'
        },
        {
            id: 'Etc/GMT-4',
            title: 'Etc/GMT-4'
        },
        {
            id: 'Etc/GMT-5',
            title: 'Etc/GMT-5'
        },
        {
            id: 'Etc/GMT-6',
            title: 'Etc/GMT-6'
        },
        {
            id: 'Etc/GMT-7',
            title: 'Etc/GMT-7'
        },
        {
            id: 'Etc/GMT-8',
            title: 'Etc/GMT-8'
        },
        {
            id: 'Etc/GMT-9',
            title: 'Etc/GMT-9'
        },
        {
            id: 'Etc/GMT0',
            title: 'Etc/GMT0'
        },
        {
            id: 'Etc/Greenwich',
            title: 'Etc/Greenwich'
        },
        {
            id: 'Etc/UCT',
            title: 'Etc/UCT'
        },
        {
            id: 'Etc/UTC',
            title: 'Etc/UTC'
        },
        {
            id: 'Etc/Universal',
            title: 'Etc/Universal'
        },
        {
            id: 'Etc/Zulu',
            title: 'Etc/Zulu'
        },
        {
            id: 'Europe/Amsterdam',
            title: 'Europe/Amsterdam'
        },
        {
            id: 'Europe/Andorra',
            title: 'Europe/Andorra'
        },
        {
            id: 'Europe/Astrakhan',
            title: 'Europe/Astrakhan'
        },
        {
            id: 'Europe/Athens',
            title: 'Europe/Athens'
        },
        {
            id: 'Europe/Belfast',
            title: 'Europe/Belfast'
        },
        {
            id: 'Europe/Belgrade',
            title: 'Europe/Belgrade'
        },
        {
            id: 'Europe/Berlin',
            title: 'Europe/Berlin'
        },
        {
            id: 'Europe/Bratislava',
            title: 'Europe/Bratislava'
        },
        {
            id: 'Europe/Brussels',
            title: 'Europe/Brussels'
        },
        {
            id: 'Europe/Bucharest',
            title: 'Europe/Bucharest'
        },
        {
            id: 'Europe/Budapest',
            title: 'Europe/Budapest'
        },
        {
            id: 'Europe/Busingen',
            title: 'Europe/Busingen'
        },
        {
            id: 'Europe/Chisinau',
            title: 'Europe/Chisinau'
        },
        {
            id: 'Europe/Copenhagen',
            title: 'Europe/Copenhagen'
        },
        {
            id: 'Europe/Dublin',
            title: 'Europe/Dublin'
        },
        {
            id: 'Europe/Gibraltar',
            title: 'Europe/Gibraltar'
        },
        {
            id: 'Europe/Guernsey',
            title: 'Europe/Guernsey'
        },
        {
            id: 'Europe/Helsinki',
            title: 'Europe/Helsinki'
        },
        {
            id: 'Europe/Isle_of_Man',
            title: 'Europe/Isle_of_Man'
        },
        {
            id: 'Europe/Istanbul',
            title: 'Europe/Istanbul'
        },
        {
            id: 'Europe/Jersey',
            title: 'Europe/Jersey'
        },
        {
            id: 'Europe/Kaliningrad',
            title: 'Europe/Kaliningrad'
        },
        {
            id: 'Europe/Kiev',
            title: 'Europe/Kiev'
        },
        {
            id: 'Europe/Kirov',
            title: 'Europe/Kirov'
        },
        {
            id: 'Europe/Lisbon',
            title: 'Europe/Lisbon'
        },
        {
            id: 'Europe/Ljubljana',
            title: 'Europe/Ljubljana'
        },
        {
            id: 'Europe/London',
            title: 'Europe/London'
        },
        {
            id: 'Europe/Luxembourg',
            title: 'Europe/Luxembourg'
        },
        {
            id: 'Europe/Madrid',
            title: 'Europe/Madrid'
        },
        {
            id: 'Europe/Malta',
            title: 'Europe/Malta'
        },
        {
            id: 'Europe/Mariehamn',
            title: 'Europe/Mariehamn'
        },
        {
            id: 'Europe/Minsk',
            title: 'Europe/Minsk'
        },
        {
            id: 'Europe/Monaco',
            title: 'Europe/Monaco'
        },
        {
            id: 'Europe/Moscow',
            title: 'Europe/Moscow'
        },
        {
            id: 'Europe/Nicosia',
            title: 'Europe/Nicosia'
        },
        {
            id: 'Europe/Oslo',
            title: 'Europe/Oslo'
        },
        {
            id: 'Europe/Paris',
            title: 'Europe/Paris'
        },
        {
            id: 'Europe/Podgorica',
            title: 'Europe/Podgorica'
        },
        {
            id: 'Europe/Prague',
            title: 'Europe/Prague'
        },
        {
            id: 'Europe/Riga',
            title: 'Europe/Riga'
        },
        {
            id: 'Europe/Rome',
            title: 'Europe/Rome'
        },
        {
            id: 'Europe/Samara',
            title: 'Europe/Samara'
        },
        {
            id: 'Europe/San_Marino',
            title: 'Europe/San_Marino'
        },
        {
            id: 'Europe/Sarajevo',
            title: 'Europe/Sarajevo'
        },
        {
            id: 'Europe/Saratov',
            title: 'Europe/Saratov'
        },
        {
            id: 'Europe/Simferopol',
            title: 'Europe/Simferopol'
        },
        {
            id: 'Europe/Skopje',
            title: 'Europe/Skopje'
        },
        {
            id: 'Europe/Sofia',
            title: 'Europe/Sofia'
        },
        {
            id: 'Europe/Stockholm',
            title: 'Europe/Stockholm'
        },
        {
            id: 'Europe/Tallinn',
            title: 'Europe/Tallinn'
        },
        {
            id: 'Europe/Tirane',
            title: 'Europe/Tirane'
        },
        {
            id: 'Europe/Tiraspol',
            title: 'Europe/Tiraspol'
        },
        {
            id: 'Europe/Ulyanovsk',
            title: 'Europe/Ulyanovsk'
        },
        {
            id: 'Europe/Uzhgorod',
            title: 'Europe/Uzhgorod'
        },
        {
            id: 'Europe/Vaduz',
            title: 'Europe/Vaduz'
        },
        {
            id: 'Europe/Vatican',
            title: 'Europe/Vatican'
        },
        {
            id: 'Europe/Vienna',
            title: 'Europe/Vienna'
        },
        {
            id: 'Europe/Vilnius',
            title: 'Europe/Vilnius'
        },
        {
            id: 'Europe/Volgograd',
            title: 'Europe/Volgograd'
        },
        {
            id: 'Europe/Warsaw',
            title: 'Europe/Warsaw'
        },
        {
            id: 'Europe/Zagreb',
            title: 'Europe/Zagreb'
        },
        {
            id: 'Europe/Zaporozhye',
            title: 'Europe/Zaporozhye'
        },
        {
            id: 'Europe/Zurich',
            title: 'Europe/Zurich'
        },
        {
            id: 'GB',
            title: 'GB'
        },
        {
            id: 'GB-Eire',
            title: 'GB-Eire'
        },
        {
            id: 'GMT',
            title: 'GMT'
        },
        {
            id: 'GMT+0',
            title: 'GMT+0'
        },
        {
            id: 'GMT-0',
            title: 'GMT-0'
        },
        {
            id: 'GMT0',
            title: 'GMT0'
        },
        {
            id: 'Greenwich',
            title: 'Greenwich'
        },
        {
            id: 'HST',
            title: 'HST'
        },
        {
            id: 'Hongkong',
            title: 'Hongkong'
        },
        {
            id: 'Iceland',
            title: 'Iceland'
        },
        {
            id: 'Indian/Antananarivo',
            title: 'Indian/Antananarivo'
        },
        {
            id: 'Indian/Chagos',
            title: 'Indian/Chagos'
        },
        {
            id: 'Indian/Christmas',
            title: 'Indian/Christmas'
        },
        {
            id: 'Indian/Cocos',
            title: 'Indian/Cocos'
        },
        {
            id: 'Indian/Comoro',
            title: 'Indian/Comoro'
        },
        {
            id: 'Indian/Kerguelen',
            title: 'Indian/Kerguelen'
        },
        {
            id: 'Indian/Mahe',
            title: 'Indian/Mahe'
        },
        {
            id: 'Indian/Maldives',
            title: 'Indian/Maldives'
        },
        {
            id: 'Indian/Mauritius',
            title: 'Indian/Mauritius'
        },
        {
            id: 'Indian/Mayotte',
            title: 'Indian/Mayotte'
        },
        {
            id: 'Indian/Reunion',
            title: 'Indian/Reunion'
        },
        {
            id: 'Iran',
            title: 'Iran'
        },
        {
            id: 'Israel',
            title: 'Israel'
        },
        {
            id: 'Jamaica',
            title: 'Jamaica'
        },
        {
            id: 'Japan',
            title: 'Japan'
        },
        {
            id: 'Kwajalein',
            title: 'Kwajalein'
        },
        {
            id: 'Libya',
            title: 'Libya'
        },
        {
            id: 'MET',
            title: 'MET'
        },
        {
            id: 'MST',
            title: 'MST'
        },
        {
            id: 'MST7MDT',
            title: 'MST7MDT'
        },
        {
            id: 'Mexico/BajaNorte',
            title: 'Mexico/BajaNorte'
        },
        {
            id: 'Mexico/BajaSur',
            title: 'Mexico/BajaSur'
        },
        {
            id: 'Mexico/General',
            title: 'Mexico/General'
        },
        {
            id: 'NZ',
            title: 'NZ'
        },
        {
            id: 'NZ-CHAT',
            title: 'NZ-CHAT'
        },
        {
            id: 'Navajo',
            title: 'Navajo'
        },
        {
            id: 'PRC',
            title: 'PRC'
        },
        {
            id: 'PST8PDT',
            title: 'PST8PDT'
        },
        {
            id: 'Pacific/Apia',
            title: 'Pacific/Apia'
        },
        {
            id: 'Pacific/Auckland',
            title: 'Pacific/Auckland'
        },
        {
            id: 'Pacific/Bougainville',
            title: 'Pacific/Bougainville'
        },
        {
            id: 'Pacific/Chatham',
            title: 'Pacific/Chatham'
        },
        {
            id: 'Pacific/Chuuk',
            title: 'Pacific/Chuuk'
        },
        {
            id: 'Pacific/Easter',
            title: 'Pacific/Easter'
        },
        {
            id: 'Pacific/Efate',
            title: 'Pacific/Efate'
        },
        {
            id: 'Pacific/Enderbury',
            title: 'Pacific/Enderbury'
        },
        {
            id: 'Pacific/Fakaofo',
            title: 'Pacific/Fakaofo'
        },
        {
            id: 'Pacific/Fiji',
            title: 'Pacific/Fiji'
        },
        {
            id: 'Pacific/Funafuti',
            title: 'Pacific/Funafuti'
        },
        {
            id: 'Pacific/Galapagos',
            title: 'Pacific/Galapagos'
        },
        {
            id: 'Pacific/Gambier',
            title: 'Pacific/Gambier'
        },
        {
            id: 'Pacific/Guadalcanal',
            title: 'Pacific/Guadalcanal'
        },
        {
            id: 'Pacific/Guam',
            title: 'Pacific/Guam'
        },
        {
            id: 'Pacific/Honolulu',
            title: 'Pacific/Honolulu'
        },
        {
            id: 'Pacific/Johnston',
            title: 'Pacific/Johnston'
        },
        {
            id: 'Pacific/Kiritimati',
            title: 'Pacific/Kiritimati'
        },
        {
            id: 'Pacific/Kosrae',
            title: 'Pacific/Kosrae'
        },
        {
            id: 'Pacific/Kwajalein',
            title: 'Pacific/Kwajalein'
        },
        {
            id: 'Pacific/Majuro',
            title: 'Pacific/Majuro'
        },
        {
            id: 'Pacific/Marquesas',
            title: 'Pacific/Marquesas'
        },
        {
            id: 'Pacific/Midway',
            title: 'Pacific/Midway'
        },
        {
            id: 'Pacific/Nauru',
            title: 'Pacific/Nauru'
        },
        {
            id: 'Pacific/Niue',
            title: 'Pacific/Niue'
        },
        {
            id: 'Pacific/Norfolk',
            title: 'Pacific/Norfolk'
        },
        {
            id: 'Pacific/Noumea',
            title: 'Pacific/Noumea'
        },
        {
            id: 'Pacific/Pago_Pago',
            title: 'Pacific/Pago_Pago'
        },
        {
            id: 'Pacific/Palau',
            title: 'Pacific/Palau'
        },
        {
            id: 'Pacific/Pitcairn',
            title: 'Pacific/Pitcairn'
        },
        {
            id: 'Pacific/Pohnpei',
            title: 'Pacific/Pohnpei'
        },
        {
            id: 'Pacific/Ponape',
            title: 'Pacific/Ponape'
        },
        {
            id: 'Pacific/Port_Moresby',
            title: 'Pacific/Port_Moresby'
        },
        {
            id: 'Pacific/Rarotonga',
            title: 'Pacific/Rarotonga'
        },
        {
            id: 'Pacific/Saipan',
            title: 'Pacific/Saipan'
        },
        {
            id: 'Pacific/Samoa',
            title: 'Pacific/Samoa'
        },
        {
            id: 'Pacific/Tahiti',
            title: 'Pacific/Tahiti'
        },
        {
            id: 'Pacific/Tarawa',
            title: 'Pacific/Tarawa'
        },
        {
            id: 'Pacific/Tongatapu',
            title: 'Pacific/Tongatapu'
        },
        {
            id: 'Pacific/Truk',
            title: 'Pacific/Truk'
        },
        {
            id: 'Pacific/Wake',
            title: 'Pacific/Wake'
        },
        {
            id: 'Pacific/Wallis',
            title: 'Pacific/Wallis'
        },
        {
            id: 'Pacific/Yap',
            title: 'Pacific/Yap'
        },
        {
            id: 'Poland',
            title: 'Poland'
        },
        {
            id: 'Portugal',
            title: 'Portugal'
        },
        {
            id: 'ROC',
            title: 'ROC'
        },
        {
            id: 'ROK',
            title: 'ROK'
        },
        {
            id: 'Singapore',
            title: 'Singapore'
        },
        {
            id: 'Turkey',
            title: 'Turkey'
        },
        {
            id: 'UCT',
            title: 'UCT'
        },
        {
            id: 'US/Alaska',
            title: 'US/Alaska'
        },
        {
            id: 'US/Aleutian',
            title: 'US/Aleutian'
        },
        {
            id: 'US/Arizona',
            title: 'US/Arizona'
        },
        {
            id: 'US/Central',
            title: 'US/Central'
        },
        {
            id: 'US/East-Indiana',
            title: 'US/East-Indiana'
        },
        {
            id: 'US/Eastern',
            title: 'US/Eastern'
        },
        {
            id: 'US/Hawaii',
            title: 'US/Hawaii'
        },
        {
            id: 'US/Indiana-Starke',
            title: 'US/Indiana-Starke'
        },
        {
            id: 'US/Michigan',
            title: 'US/Michigan'
        },
        {
            id: 'US/Mountain',
            title: 'US/Mountain'
        },
        {
            id: 'US/Pacific',
            title: 'US/Pacific'
        },
        {
            id: 'US/Pacific-New',
            title: 'US/Pacific-New'
        },
        {
            id: 'US/Samoa',
            title: 'US/Samoa'
        },
        {
            id: 'UTC',
            title: 'UTC'
        },
        {
            id: 'Universal',
            title: 'Universal'
        },
        {
            id: 'W-SU',
            title: 'W-SU'
        },
        {
            id: 'WET',
            title: 'WET'
        },
        {
            id: 'Zulu',
            title: 'Zulu'
        }
    ],
});
