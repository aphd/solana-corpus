################################################
########## Block dataset # Poisson distribution
################################################

library(dplyr)
library(ggplot2)

data = read.csv('~/github/aphd/solana-corpus/data/csv/blocks-info.csv', stringsAsFactors=T)
df <- data[,c(1, 3,7)]
df <- filter(df, transactions!='n/a' & transactions!='NA') 
df <- df[order(df$blockId),]
df <- filter(df, df$blockId %% 10 == 0)
df$delta <- c(NA, diff(df$blockTime))
df$delta <- df$delta * 100
ggplot(df, aes(x=delta)) + geom_histogram() + stat_bin(aes(y=..count..), binwidth=100) + xlab("block time [ms]") + ylab("Number of transactions")

################################################
############ Transactions' throughput  - TPS
################################################
library(dplyr)
library(ggplot2)

data = read.csv('~/github/aphd/solana-corpus/data/csv/blocks-info.csv', stringsAsFactors=T)
df <- data[, c("blockTime", "transactions")]
df <- df[order(df$blockTime),]
agg <- aggregate(. ~ blockTime, df, sum) #or aggregate(df$transactions, by=list(blockTime=df$blockTime), FUN=sum)
agg <- filter(agg, transactions > 1 & transactions < 10000)
par(cex.axis=0.8, mar=c(1, 5, 2, 1))
boxplot(agg$transactions, ylab="Transactions' throughput (TPS)", cex.lab = 1.1)

################################################
############ Transactions per block - TPB
################################################
library(dplyr)
library(ggplot2)

data = read.csv('~/github/aphd/solana-corpus/data/csv/blocks-info.csv', stringsAsFactors=T)
df <- data[, c("transactions")]
df <- df[df != 'n/a']
par(cex.axis=0.8, mar=c(1, 5, 2, 1))
boxplot(df, ylab="Transactions per block (TPB)", cex.lab = 1.1)
