+++
title = "ISDN Linked Data"
description = "ISDNのSPARQLエンドポイント"
tags = []
categories = ["ISDN"]
toc = true
+++

ISDN (International Standard Dojin Numbering; 国際標準同人誌番号) のRDFデータを提供するSPARQLエンドポイントです。

データセット生成については以下リポジトリをご覧ください。

- RDF変換ツール: [Babibubebon/isdn-ld](https://github.com/Babibubebon/isdn-ld)

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
  ?s schema:publisher/schema:name "ばびぶべぼ研究室" ;
     schema:name ?name ;
     schema:datePublished ?datePublished .
}
ORDER BY DESC(?datePublished)
{{< /yasgui-query >}}

{{< yasgui-query yasgui-id="isdn" title="サークル毎に出版物のページ数の総和を集計して大きい順に並べる" >}}
PREFIX isdn: <http://metadata.moe/ns/isdn/>
PREFIX schema: <http://schema.org/>

SELECT ?isdnRegistrant ?publisherName (SUM(?numberOfPages) AS ?sumPages)
{
  ?s schema:numberOfPages ?numberOfPages ;
     schema:publisher [
      isdn:isdnRegistrant ?isdnRegistrant ;
      schema:name ?publisherName ;
     ] .
}
GROUP BY ?isdnRegistrant ?publisherName
ORDER BY DESC(?sumPages)
LIMIT 100
{{< /yasgui-query >}}

{{< yasgui-query yasgui-id="isdn" title="すべてのグラフを横断して全リソースを検索する" >}}
PREFIX isdn: <http://metadata.moe/ns/isdn/>
PREFIX schema: <http://schema.org/>

SELECT ?ratingAge (COUNT(*) AS ?cnt)
# SPARQL非標準ですが、Apache Jena独自のデフォルトグラフURIが利用できます
FROM <urn:x-arq:DefaultGraph>
FROM <http://isdn.metadata.moe/graph/ageRestricted15>
FROM <http://isdn.metadata.moe/graph/ageRestricted18>
{
  ?s a isdn:DoujinProduct ;
     isdn:ratingAge ?ratingAge .
}
GROUP BY ?ratingAge
{{< /yasgui-query >}}

{{< yasgui-query yasgui-id="isdn" title="コミケジャンル毎に出版物を集計して多い順に並べる" >}}
PREFIX isdn: <http://metadata.moe/ns/isdn/>
PREFIX schema: <http://schema.org/>

SELECT ?comicketGenreName (COUNT(DISTINCT ?s) AS ?count)
FROM <urn:x-arq:DefaultGraph>
FROM <http://isdn.metadata.moe/graph/ageRestricted15>
FROM <http://isdn.metadata.moe/graph/ageRestricted18>
{
  ?s schema:genre [
    a isdn:ComiketGenre ;
    schema:name ?comicketGenreName ;
  ]
}
GROUP BY ?comicketGenreName
ORDER BY DESC(?count)
{{< /yasgui-query >}}

{{< yasgui-query yasgui-id="isdn" title="コミケジャンル×レーティングで出版物をクロス集計して多い順に並べる" >}}
PREFIX isdn: <http://metadata.moe/ns/isdn/>
PREFIX schema: <http://schema.org/>

SELECT ?comicketGenreName ?ratingGender ?ratingAge (COUNT(*) AS ?count)
FROM <urn:x-arq:DefaultGraph>
FROM <http://isdn.metadata.moe/graph/ageRestricted15>
FROM <http://isdn.metadata.moe/graph/ageRestricted18>
WHERE {
  ?work schema:genre [
          a isdn:ComiketGenre ;
          schema:name ?comicketGenreName ;
        ] ;
        isdn:ratingGender ?ratingGender ;
        isdn:ratingAge ?ratingAge .
}
GROUP BY ?comicketGenreName ?ratingGender ?ratingAge
ORDER BY DESC(?count)
{{< /yasgui-query >}}

{{< yasgui-query yasgui-id="isdn" title="形態毎に出版物を集計して多い順に並べる" >}}
PREFIX isdn: <http://metadata.moe/ns/isdn/>
PREFIX schema: <http://schema.org/>

SELECT ?category (COUNT(DISTINCT ?s) AS ?count)
FROM <urn:x-arq:DefaultGraph>
FROM <http://isdn.metadata.moe/graph/ageRestricted15>
FROM <http://isdn.metadata.moe/graph/ageRestricted18>
{
  ?s schema:category ?category
}
GROUP BY ?category
ORDER BY DESC(?count)
{{< /yasgui-query >}}

## グラフURI一覧

年齢制限のあるコンテンツに関しては、グラフURIを分けています。

- デフォルトグラフ : 一般
- `http://isdn.metadata.moe/graph/ageRestricted15` : 15禁
- `http://isdn.metadata.moe/graph/ageRestricted18` : 18禁

## 語彙・制約記述

- RDF Schema: <http://metadata.moe/ns/isdn/>
- SHACL Shapes: <http://metadata.moe/ns/isdn/shapes/>

## リソースURI

`http://isdn.metadata.moe/res/{isdn}`

HTTPで参照すると、コンテンツネゴシエーションでリダイレクトされます。

- HTMLページ: `https://isdn.metadata.moe/page/{isdn}`
- データ: `https://isdn.metadata.moe/data/{isdn}.{file_ext}`
  - file_ext: `nt`, `ttl`, `json`, `jsonld`, `rdf`
