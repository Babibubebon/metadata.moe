const fieldIdToCode = {
    'manga': 'cm',
    'animation': 'an',
    'game': 'gm',
    'mediaart': 'ma',
    'collection': 'co',
}
const fieldIdToAdditionalType = {
    'manga': 'class:CM',
    'animation': 'class:AN',
    'game': 'class:GM',
    'mediaart': 'class:MA',
    'collection': 'class:CO',
}
const categoryIdToClass = {
    'cm-item': ['class:MangaBook', 'class:MangaMagazineIssue', 'class:MangaOther'],
    'cm-col': ['class:MangaBookSeries', 'class:MangaMagazine', 'class:MangaMagazinePublication'],
    'an-item': ['class:AnimationTVProgram', 'class:AnimationVideoPackage', 'class:AnimationMovie'],
    'an-col': ['class:AnimationTVRegularSeries', 'class:AnimationTVSpecialSeries', 'class:AnimationMovieSeries'],
    'gm-item': ['class:GamePackage'],
    'gm-col': ['class:GameVariation', 'class:GameWork'],
    'ma-item': ['class:MediaArtExhibitionOrPerformance'],
    'ma-col': ['class:MediaArtEvent'],
    'co-curate': ['class:Agent'],
}
const subcategoryIdToClass = {
    'cm101': 'class:MangaBook',
    'cm102': 'class:MangaMagazineIssue',
    'cm103': 'class:MangaOther',
    'cm104': 'class:MangaBookSeries',
    'cm105': 'class:MangaMagazine',
    'cm106': 'class:MangaMagazinePublication',
    'an201': 'class:AnimationTVProgram',
    'an202': 'class:AnimationVideoPackage',
    'an205': 'class:AnimationMovie',
    'an207': 'class:AnimationTVRegularSeries',
    'an208': 'class:AnimationTVSpecialSeries',
    'an210': 'class:AnimationMovieSeries',
    'gm301': 'class:GamePackage',
    'gm305': 'class:GameVariation',
    'gm306': 'class:GameWork',
    'ma401': 'class:MediaArtExhibitionOrPerformance',
    'ma408': 'class:MediaArtEvent',
    'co504': 'class:Agent',
}
const sortToOrderByTerm = {
    'title': 'rdfs:label',
    'date': 'schema:datePublished',
}
const fulltextSearchFieldToTerm = {
    'name': 'schema:name',
    'alternativeHeadline': 'schema:alternativeHeadline',
    'genre': 'schema:genre',
    'label': 'rdfs:label',
    'seriesName': 'ma:seriesName',
    'volumeNumber': 'schema:volumeNumber',
    'issueNumber': 'schema:issueNumber',
    'creator': 'schema:creator',
    'actor': 'schema:actor',
    'publisher': 'schema:publisher',
    'description': 'schema:description',
    'keywords': 'schema:keywords',
    'inLanguage': 'schema:inLanguage'
}

function escapeStringLiteral(text) {
    text = text.replace('"', '\\"')
    text = text.replace('\'', '\\\'')
    text = text.replace('\\', '\\\\')
    return text
}

function addIndent(text, level = 1) {
    let spaces = ''
    for (let i = 1; i <= level; i++) {
        spaces += '    '
    }
    text = text.replace(new RegExp('\n', 'g'), '\n' + spaces)
    return spaces + text
}

const app = Vue.createApp({
    data: () => ({
        apireq: {
            'fieldId': '',
            'categoryId': '',
            'subcategoryId': '',
            'aipId': '',
            'q': '',
            'sort': 'title',
            'offset': 0,
            'limit': 20,
            'name': '',
            'alternativeHeadline': '',
            'genre': '',
            'label': '',
            'seriesName': '',
            'volumeNumber': '',
            'issueNumber': '',
            'creator': '',
            'actor': '',
            'publisher': '',
            'description': '',
            'keywords': '',
            'inLanguage': '',
        }
    }),
    methods: {
        onChangeFieldId: function () {
            if (!this.apireq.fieldId) {
                return
            }
            const selectedFieldCode = fieldIdToCode[this.apireq.fieldId]
            console.log(selectedFieldCode)
            if (this.apireq.categoryId.indexOf(selectedFieldCode) === -1) {
                this.apireq.categoryId = '';
            }
            if (this.apireq.subcategoryId.indexOf(selectedFieldCode) === -1) {
                this.apireq.subcategoryId = '';
            }
        }
    },
    computed: {
        categoryIdOptions: function () {
            const options = [
                'cm-item',
                'cm-col',
                'an-item',
                'an-col',
                'gm-item',
                'gm-col',
                'ma-item',
                'ma-col',
                'co-curate',
            ]
            return options.filter(v => {
                return !this.apireq.fieldId || v.startsWith(fieldIdToCode[this.apireq.fieldId])
            })
        },
        subcategoryIdOptions: function () {
            let code = null
            if (this.apireq.fieldId) {
                code = fieldIdToCode[this.apireq.fieldId]
            }
            if (this.apireq.categoryId) {
                code = this.apireq.categoryId.substring(0, 2)
            }
            return Object.keys(subcategoryIdToClass).filter(v => {
                return !code || v.startsWith(code)
            })
        },
        webApiQuery: function () {
            const reqUrl = new URL('https://mediaarts-db.bunka.go.jp/api/search')
            for (let key of Object.keys(this.apireq)) {
                if (this.apireq[key] === '') {
                    continue
                }
                reqUrl.searchParams.append(key, this.apireq[key])
            }
            return reqUrl.href
        },
        sparqlMadbLabUrl: function () {
            return 'https://mediag.bunka.go.jp/madb_lab/lod/sparql/#query=' + encodeURIComponent(this.sparqlQuery)
        },
        sparqlQuery: function () {
            const patterns = [
                ['?s', 'schema:identifier', '?identifier']
            ]
            const filters = [
                'FILTER(!STRSTARTS(?identifier, "S"))'
            ]
            const optionalPatterns = [
                ['?s', 'schema:genre', '?genre'],
                ['?s', 'rdfs:label', '?title']
            ]
            const optionalFilters = []

            if (this.apireq.fieldId) {
                patterns.push(['?s', 'schema:additionalType', fieldIdToAdditionalType[this.apireq.fieldId]])
            }
            if (this.apireq.categoryId) {
                patterns.push(['?s', 'a', '?class'])
                filters.push(`VALUES ?class {${categoryIdToClass[this.apireq.categoryId].join(' ')}}`)
            }
            if (this.apireq.subcategoryId) {
                patterns.push(['?s', 'a', subcategoryIdToClass[this.apireq.subcategoryId]])
            }
            if (this.apireq.aipId) {
                patterns.push(['?s', 'schema:identifier', `"${this.apireq.aipId}"`])
            }

            /**
             * 全文検索
             */
            if (this.apireq.q) {
                const value = escapeStringLiteral(this.apireq.q)
                filters.push(`
SERVICE neptune-fts:search {
    neptune-fts:config neptune-fts:endpoint "https://vpc-mediaarts-db-qaymrmtqbprlhmqq33a2ncf4ke.ap-northeast-1.es.amazonaws.com" .
    neptune-fts:config neptune-fts:queryType "simple_query_string" .
    neptune-fts:config neptune-fts:query "\\"${value}\\"" .
    neptune-fts:config neptune-fts:return ?s .
}`)
            }

            /**
             * フィールド別全文検索
             */
            for (let field of Object.keys(fulltextSearchFieldToTerm)) {
                if (this.apireq[field] !== '') {
                    const variableName = `?${field}`
                    const term = fulltextSearchFieldToTerm[field]
                    const value = escapeStringLiteral(this.apireq[field])

                    patterns.push(['?s', term, variableName])
                    filters.push(`
SERVICE neptune-fts:search {
    neptune-fts:config neptune-fts:endpoint "https://vpc-mediaarts-db-qaymrmtqbprlhmqq33a2ncf4ke.ap-northeast-1.es.amazonaws.com" .
    neptune-fts:config neptune-fts:field ${term}.
    neptune-fts:config neptune-fts:queryType "simple_query_string" .
    neptune-fts:config neptune-fts:query "\\"${value}\\"" .
    neptune-fts:config neptune-fts:return ?s .
}`)
                }
            }

            /**
             * ORDER BY
             */
            let orderByClause = ''
            if (this.apireq.sort !== '') {
                if (this.apireq.sort !== 'title') {
                    optionalPatterns.push(['?s', sortToOrderByTerm[this.apireq.sort], `?${this.apireq.sort}`])
                }
                orderByClause = `ORDER BY ?${this.apireq.sort}`
            }

            /**
             * OFFSET, LIMIT
             */
            let offsetClause = ''
            if (this.apireq.offset !== '') {
                offsetClause = `OFFSET ${this.apireq.offset}`
            }
            let limitClause = ''
            if (this.apireq.limit !== '') {
                limitClause = `LIMIT ${this.apireq.limit}`
            }

            /**
             * Build patterns
             */
            let patternString = ''
            patterns.forEach(triple => {
                patternString += addIndent(triple.join(' ')) + ' .\n'
            })
            patternString = patternString.trimEnd('\n')
            let filterString = '\n'
            filters.forEach(filter => {
                filterString += addIndent(filter) + '\n'
            })
            filterString = filterString.trimEnd('\n')

            /**
             * Build optional patterns
             */
            let optionalPatternString = ''
            optionalPatterns.forEach(triple => {
                optionalPatternString += addIndent(triple.join(' '), 2) + ' .\n'
            })
            optionalPatternString = optionalPatternString.trimEnd('\n')
            let optionalFilterString = ''
            optionalFilters.forEach(filter => {
                optionalFilterString += addIndent(filter, 2) + '\n'
            })
            if (optionalPatterns.length > 0) {
                optionalPatternString = `    OPTIONAL {\n${optionalPatternString}\n${optionalFilterString}    }`
            }

            return `PREFIX ma: <https://mediaarts-db.bunka.go.jp/data/property#>
PREFIX class: <https://mediaarts-db.bunka.go.jp/data/class#>
PREFIX rdfs:   <http://www.w3.org/2000/01/rdf-schema#>
PREFIX schema: <https://schema.org/>
PREFIX neptune-fts: <http://aws.amazon.com/neptune/vocab/v01/services/fts#>

SELECT
    DISTINCT ?s ?genre ?title
WHERE {
${patternString}${filterString}
${optionalPatternString}
}
${orderByClause}
${offsetClause}
${limitClause}`
        }
    }
})
app.config.compilerOptions.delimiters = ['${', '}']
app.mount('#app')