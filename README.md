# ts_multi_project

カバレッジ出力あり  
ルートディレクトリに`coverage`ディレクトリが生成される。

```
npx jest --coverage
```

下記でカバレッジ範囲指定可能

```
--collectCoverageFrom='./src/**'
```

ut:で始まるテストのみ実行

```
npx jest -t ^ut:
```

jest の結果レポート生成は下記パッケージが必要

```
npm install --save-dev jest-html-reporters
```

--reporters オプションで指定  
以下はデフォルトのコンソール出力 + html 出力両方  
ルートディレクトリに`jest_html_reporters.html`が生成される。

```
npx jest --reporters=default --reporters=jest-html-reporters
```
