########################
# Block dataset 
# Poisson distribution

# Requirements
library(dplyr)

data = read.csv('~/github/aphd/solana-corpus/data/csv/blocks-info.csv', stringsAsFactors=T)

df <- data[,c(1, 3,7)]
df <- filter(df, transactions!='n/a') 
head(df)

df <- df[order(df$blockId),]
df <- filter(df, df$blockId %% 10 == 0)
df$delta <- c(NA, diff(df$blockTime))
df$delta <- df$delta * 100

library(ggplot2)
ggplot(df, aes(x=delta))+ geom_histogram() + stat_bin(aes(y=..count.., label=..count..), binwidth=100) + xlab("block time [ms]")

#cumulative density of block time (CDF of blocktimes)
dff <- filter(df, df$deltaBlockTime > -1 & df$deltaBlockTime < 1500)
dff$ID <- seq.int(nrow(dff))
dff$blockTime <- as.numeric(as.character(dff[,1]))
dff <- dff[order(dff$blockTime),]
dff$deltaBlockTime <- c(NA, diff(dff$blockTime))
df_blockTime <- filter(dff, dff$ID %% 10 == 0))
df_blockTime$deltaBlockTime <- c(NA, diff(df_blockTime$blockTime))

agg <- aggregate(. ~ blockTime, df, sum) #or aggregate(df$transactions, by=list(blockTime=df$blockTime), FUN=sum)

max(agg$transactions)
min(agg$transactions)

boxplot(agg$transactions, ylab="Transactions per second (TPS)", main="Transactions' throughput")

############
# programsInfo dataset
df <- read.csv('~/github/aphd/solana-corpus/data/csv/programsInfo.csv')
df[,c("ProgramId", "LastDeployedInSlot", "DataLength", "Balance")]

#df[] <- lapply(df, function(x) type.convert(as.character(x)))

#df <- head(filter(df, df$delta > -100 & df$delta < 100))
