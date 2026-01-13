+++
title = "ISDN Linked Data"
description = "ISDNのSPARQLエンドポイント"
tags = []
categories = ["ISDN"]
toc = true
+++

ISDN (International Standard Dojin Numbering; 国際標準同人誌番号) のRDFデータを提供するSPARQLエンドポイントです。

データセット生成については以下リポジトリをご覧ください。

- [Babibubebon/isdn-ld](https://github.com/Babibubebon/isdn-ld): RDF変換ツール

なお、Linked "Open" Data ではないことにご留意ください。

-----

データ更新日: <date>`2026-01-13`</date>

Endpoint: `https://sparql.metadata.moe/isdn/query`

## クエリエディタ

{{< yasgui id="isdn" endpoint="https://sparql.metadata.moe/isdn/query"
    default-query=`
PREFIX isdn: <http://metadata.moe/ns/isdn/>
PREFIX schema: <http://schema.org/>

SELECT *
{
  ?s ?p ?o
}
LIMIT 100`
>}}

### サンプルクエリ

{{< yasgui-query yasgui-id="isdn" title="ISDNを指定してリソースの情報を取得する" >}}
PREFIX isdn: <http://metadata.moe/ns/isdn/>
PREFIX schema: <http://schema.org/>

DESCRIBE ?s
{
  ?s isdn:isdn "2784663011044" .
}
{{< /yasgui-query >}}

{{< yasgui-query yasgui-id="isdn" title="出版者(サークル)で検索する" >}}
PREFIX isdn: <http://metadata.moe/ns/isdn/>
PREFIX schema: <http://schema.org/>

SELECT *
{
  ?s schema:publisher/schema:name "ばびぶべぼ研究室"@ja ;
     schema:name ?name ;
     schema:datePublished ?datePublished .
  
  FILTER (LANG(?name) = "ja")
}
ORDER BY DESC(?datePublished)
{{< /yasgui-query >}}

{{< yasgui-query yasgui-id="isdn" title="サークル毎に出版物のページ数の総和を集計して大きい順に並べる" >}}
PREFIX isdn: <http://metadata.moe/ns/isdn/>
PREFIX schema: <http://schema.org/>

SELECT ?publisherName (SUM(?numberOfPages) AS ?sumPages)
{
  ?s schema:numberOfPages ?numberOfPages ;
     schema:publisher [
      schema:identifier ?publisherId ;
      schema:name ?publisherName ;
     ] .
  
  FILTER (LANG(?publisherName) = "ja")
}
GROUP BY ?publisherId ?publisherName
ORDER BY DESC(?sumPages)
LIMIT 100
{{< /yasgui-query >}}

{{< yasgui-query yasgui-id="isdn" title="すべてのグラフを横断して全リソースを検索する" >}}
PREFIX isdn: <http://metadata.moe/ns/isdn/>
PREFIX schema: <http://schema.org/>

SELECT ?ratingAge (COUNT(*) AS ?cnt)
# SPARQL非標準ですが、Apache Jena独自のデフォルトグラフURIが利用できます
FROM <urn:x-arq:DefaultGraph>
FROM <http://metadata.moe/isdn/graph/ageRestricted15>
FROM <http://metadata.moe/isdn/graph/ageRestricted18>
{
  ?s isdn:ratingAge ?ratingAge .
}
GROUP BY ?ratingAge
{{< /yasgui-query >}}

{{< yasgui-query yasgui-id="isdn" title="コミケジャンル毎に出版物を集計して多い順に並べる" >}}
PREFIX isdn: <http://metadata.moe/ns/isdn/>
PREFIX schema: <http://schema.org/>

SELECT ?comicketGenreName (COUNT(DISTINCT ?s) AS ?cnt)
FROM <urn:x-arq:DefaultGraph>
FROM <http://metadata.moe/isdn/graph/ageRestricted15>
FROM <http://metadata.moe/isdn/graph/ageRestricted18>
{
  ?s schema:genre [
    a isdn:ComiketGenre ;
    schema:name ?comicketGenreName ;
  ]
}
GROUP BY ?comicketGenreName
ORDER BY DESC(?cnt)
{{< /yasgui-query >}}

## グラフURI一覧

年齢制限のあるコンテンツに関しては、グラフURIを分けています。

- デフォルトグラフ : 一般
- `http://metadata.moe/isdn/graph/ageRestricted15` : 15禁
- `http://metadata.moe/isdn/graph/ageRestricted18` : 18禁
