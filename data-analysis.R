# Requirements
library(dplyr)

data = read.csv('~/github/aphd/solana-corpus/data/csv/blocks-info.csv', stringsAsFactors=T)

df <- data[,c(3,7)]
df <- filter(df, transactions!='n/a') 
head(df)

# How to sum a variable by group
df[] <- lapply(df, function(x) type.convert(as.character(x)))

agg <- aggregate(. ~ blockTime, df, sum) #or aggregate(df$transactions, by=list(blockTime=df$blockTime), FUN=sum)

max(agg$transactions)
min(agg$transactions)

boxplot(agg$transactions, ylab="Transactions per second (TPS)", main="Transactions' throughput")
